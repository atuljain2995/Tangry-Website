'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/db/supabase';
import { incrementCouponUsage, decrementVariantStock } from '@/lib/db/queries';
import {
  computeTrustedOrderDraft,
  orderLinesFromCartItems,
} from '@/lib/orders/compute-trusted-order';
import { generateOrderNumber } from '@/lib/utils/database';
import { sendOrderConfirmationEmail } from '@/lib/email/order-confirmation';
import { getSessionUser } from '@/lib/auth/session';
import type { Address, CartItem, PaymentMethod } from '@/lib/types/database';

export type CreateOrderPayload = {
  /** Client may send display fields; only productId, variantId, quantity are trusted. */
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
  const {
    items,
    shippingAddress,
    billingAddress,
    paymentMethod,
    paymentId,
    userEmail,
    couponCode,
  } = payload;

  if (!items?.length) {
    return { success: false, error: 'Cart is empty' };
  }
  if (!userEmail?.trim()) {
    return { success: false, error: 'Email is required' };
  }

  try {
    // Link order to logged-in user if available; also used to enforce
    // first-order-only coupons at placement time.
    const sessionUser = await getSessionUser().catch(() => null);

    const lines = orderLinesFromCartItems(items);
    const trusted = await computeTrustedOrderDraft({
      lines,
      couponCode,
      country: shippingAddress.country || 'IN',
      userId: sessionUser?.id ?? null,
    });
    if (!trusted.ok) {
      return { success: false, error: trusted.error };
    }

    const {
      items: trustedItems,
      subtotal,
      discount,
      couponId,
      tax,
      shipping,
      total,
    } = trusted.draft;

    const orderItems = trustedItems.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      productName: i.productName,
      variantName: i.variantName,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.price * i.quantity,
      image: i.image,
    }));

    // Validate stock availability BEFORE creating the order to prevent overselling
    for (const item of trustedItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: variant } = await (supabaseAdmin as any)
        .from('product_variants')
        .select('stock, sku')
        .eq('id', item.variantId)
        .single();

      if (!variant) {
        return { success: false, error: `Product "${item.productName}" is no longer available.` };
      }
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error:
            variant.stock === 0
              ? `"${item.productName} – ${item.variantName}" is out of stock.`
              : `Only ${variant.stock} units of "${item.productName} – ${item.variantName}" are available.`,
        };
      }
    }

    const orderNumber = generateOrderNumber();

    // Decrement stock first (before inserting order) to minimise oversell window
    for (const item of trustedItems) {
      const ok = await decrementVariantStock(item.variantId, item.quantity);
      if (!ok) {
        // Stock changed between check and decrement — abort
        return {
          success: false,
          error: `"${item.productName} – ${item.variantName}" just went out of stock. Please try again.`,
        };
      }
    }

    // Link order to logged-in user if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: orderError } = await (supabaseAdmin as any).from('orders').insert({
      order_number: orderNumber,
      user_id: sessionUser?.id ?? null,
      user_email: userEmail.trim(),
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: 'INR',
      order_status: 'pending',
      payment_status:
        paymentMethod === 'cod' || (paymentMethod === 'razorpay' && paymentId)
          ? 'completed'
          : 'pending',
      payment_method: paymentMethod,
      payment_id: paymentId ?? null,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    });

    if (orderError) {
      console.error('Order insert error:', orderError);
      return { success: false, error: 'Failed to create order. Please try again.' };
    }

    if (couponId) {
      await incrementCouponUsage(couponId);
    }

    const paymentCompleted = paymentMethod === 'cod' || (paymentMethod === 'razorpay' && paymentId);
    if (paymentCompleted) {
      void sendOrderConfirmationEmail({
        to: userEmail.trim(),
        orderNumber,
        total,
        currency: 'INR',
        items: trustedItems.map((i) => ({
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          price: i.price,
        })),
      })
        .then(async (result) => {
          if (result.ok) return;
          // Flag on the order itself so admins reviewing the order see the delivery failure
          // even though the checkout flow already completed successfully for the customer.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabaseAdmin as any)
            .from('orders')
            .update({
              notes: `[auto] Confirmation email failed to send: ${result.error ?? 'unknown error'}`,
            })
            .eq('order_number', orderNumber);
        })
        .catch((err) => console.error('Order confirmation email:', err));
    }

    return { success: true, orderNumber };
  } catch (err) {
    // Never let an unexpected exception surface as a generic "Payment failed"
    // to the customer. Log full context server-side and return a clean error.
    console.error('[createOrder] Unexpected failure:', {
      paymentMethod,
      paymentId: paymentId ?? null,
      userEmail: userEmail.trim(),
      itemCount: items.length,
      error: err,
    });
    return {
      success: false,
      error: 'We could not complete your order due to a technical issue. Please try again.',
    };
  }
}

/**
 * Link guest-checkout orders to the currently signed-in user.
 * Only claims orders that are still unowned (user_id is null) AND were placed with the
 * same email as the signed-in account — the client only supplies order numbers, never
 * an email, so this cannot be used to claim someone else's order by guessing a number.
 */
export async function claimGuestOrders(
  orderNumbers: string[],
): Promise<{ success: true; claimed: string[] } | { success: false; error: string }> {
  const sessionUser = await getSessionUser().catch(() => null);
  if (!sessionUser) {
    return { success: false, error: 'Not signed in' };
  }

  const numbers = [...new Set(orderNumbers)].filter((n) => typeof n === 'string' && n.trim()).slice(0, 20);
  if (!numbers.length) {
    return { success: true, claimed: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: candidates, error: fetchError } = await (supabaseAdmin as any)
    .from('orders')
    .select('id, order_number, user_email')
    .in('order_number', numbers)
    .is('user_id', null);

  if (fetchError) {
    console.error('claimGuestOrders fetch error:', fetchError);
    return { success: false, error: 'Could not link previous orders' };
  }

  const targetEmail = sessionUser.email.trim().toLowerCase();
  const matches = ((candidates ?? []) as { id: string; order_number: string; user_email: string }[]).filter(
    (o) => o.user_email?.trim().toLowerCase() === targetEmail,
  );

  if (!matches.length) {
    return { success: true, claimed: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabaseAdmin as any)
    .from('orders')
    .update({ user_id: sessionUser.id })
    .in(
      'id',
      matches.map((m) => m.id),
    );

  if (updateError) {
    console.error('claimGuestOrders update error:', updateError);
    return { success: false, error: 'Could not link previous orders' };
  }

  return { success: true, claimed: matches.map((m) => m.order_number) };
}

const VALID_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export async function updateOrderStatus(
  orderId: string,
  orderStatus: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!VALID_ORDER_STATUSES.includes(orderStatus as (typeof VALID_ORDER_STATUSES)[number])) {
    return { success: false, error: 'Invalid status' };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin as any)
    .from('orders')
    .update({
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
      // Stamp delivery time once so the review-request cron can fire 3–5 days later.
      ...(orderStatus === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderId);
  if (error) {
    console.error('updateOrderStatus error:', error);
    return { success: false, error: (error as { message?: string })?.message ?? 'Update failed' };
  }
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function setOrderTrackingNumber(
  orderId: string,
  trackingNumber: string | null,
): Promise<{ success: true } | { success: false; error: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin as any)
    .from('orders')
    .update({
      tracking_number: trackingNumber?.trim() || null,
      updated_at: new Date().toISOString(),
      ...(trackingNumber?.trim() ? { order_status: 'shipped' } : {}),
    })
    .eq('id', orderId);
  if (error) {
    console.error('setOrderTrackingNumber error:', error);
    return { success: false, error: (error as { message?: string })?.message ?? 'Update failed' };
  }
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
