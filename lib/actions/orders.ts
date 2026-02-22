'use server';

import { supabaseAdmin } from '@/lib/db/supabase';
import {
  validateCouponAndGetDiscount,
  incrementCouponUsage,
  decrementVariantStock,
} from '@/lib/db/queries';
import { calculateShipping, calculateTax, generateOrderNumber } from '@/lib/utils/database';
import type { Address, CartItem, PaymentMethod } from '@/lib/types/database';

export type CreateOrderPayload = {
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentId?: string | null;
  userEmail: string;
  couponCode?: string | null;
};

export type CreateOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResult> {
  const { items, shippingAddress, billingAddress, paymentMethod, paymentId, userEmail, couponCode } = payload;

  if (!items?.length) {
    return { success: false, error: 'Cart is empty' };
  }
  if (!userEmail?.trim()) {
    return { success: false, error: 'Email is required' };
  }

  // Compute subtotal from items
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Validate coupon and get server-side discount
  let discount = 0;
  let couponId: string | undefined;
  if (couponCode?.trim()) {
    const result = await validateCouponAndGetDiscount(couponCode.trim(), subtotal);
    if ('error' in result) {
      return { success: false, error: result.error };
    }
    discount = result.discount;
    couponId = result.couponId;
  }

  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount);
  const shipping = calculateShipping(afterDiscount, shippingAddress.country || 'IN');
  const total = afterDiscount + tax + shipping;

  // Build order items for JSONB
  const orderItems = items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    productName: i.productName,
    variantName: i.variantName,
    quantity: i.quantity,
    price: i.price,
    subtotal: i.price * i.quantity,
    image: i.image,
  }));

  const orderNumber = generateOrderNumber();

  // Insert order (use service role to bypass RLS). user_id null for guest.
  const { error: orderError } = await (supabaseAdmin as any)
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: null,
      user_email: userEmail.trim(),
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: 'INR',
      order_status: 'pending',
      payment_status: paymentMethod === 'cod' || (paymentMethod === 'razorpay' && paymentId) ? 'completed' : 'pending',
      payment_method: paymentMethod,
      payment_id: paymentId ?? null,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    });

  if (orderError) {
    console.error('Order insert error:', orderError);
    return { success: false, error: 'Failed to create order. Please try again.' };
  }

  // Decrement stock for each line item
  for (const item of items) {
    const ok = await decrementVariantStock(item.variantId, item.quantity);
    if (!ok) {
      console.error(`Failed to decrement stock for variant ${item.variantId}`);
      // Order already placed; log and continue (admin can fix stock)
    }
  }

  if (couponId) {
    await incrementCouponUsage(couponId);
  }

  return { success: true, orderNumber };
}
