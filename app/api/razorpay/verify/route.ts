import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createOrder } from '@/lib/actions/orders';
import { computeTrustedOrderDraft, orderLinesFromCartItems } from '@/lib/orders/compute-trusted-order';
import type { CreateOrderPayload } from '@/lib/actions/orders';
import type { Address, CartItem } from '@/lib/types/database';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!keySecret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  return expected === signature;
}

/** Checkout may omit DB-only fields (id, userId). */
function isAddressShape(x: unknown): x is Record<string, unknown> {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.fullName === 'string' &&
    typeof o.phone === 'string' &&
    typeof o.addressLine1 === 'string' &&
    typeof o.city === 'string' &&
    typeof o.state === 'string' &&
    typeof o.postalCode === 'string' &&
    typeof o.country === 'string'
  );
}

function parseCreateOrderPayload(raw: unknown): CreateOrderPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const items = p.items;
  if (!Array.isArray(items) || items.length === 0) return null;
  const cartItems: CartItem[] = [];
  for (const row of items) {
    if (!row || typeof row !== 'object') return null;
    const o = row as Record<string, unknown>;
    if (
      typeof o.productId !== 'string' ||
      typeof o.variantId !== 'string' ||
      typeof o.quantity !== 'number' ||
      typeof o.productName !== 'string' ||
      typeof o.variantName !== 'string' ||
      typeof o.price !== 'number' ||
      typeof o.image !== 'string'
    ) {
      return null;
    }
    cartItems.push({
      productId: o.productId,
      variantId: o.variantId,
      quantity: o.quantity,
      productName: o.productName,
      variantName: o.variantName,
      price: o.price,
      image: o.image,
    });
  }
  if (!isAddressShape(p.shippingAddress) || !isAddressShape(p.billingAddress)) return null;
  if (typeof p.userEmail !== 'string' || !p.userEmail.trim()) return null;
  const pm = p.paymentMethod;
  if (pm !== 'razorpay' && pm !== 'cod' && pm !== 'stripe' && pm !== 'bank_transfer') return null;

  const shippingAddress = {
    ...p.shippingAddress,
    type: 'shipping' as const,
    id: typeof p.shippingAddress.id === 'string' ? p.shippingAddress.id : '',
    userId: typeof p.shippingAddress.userId === 'string' ? p.shippingAddress.userId : '',
    isDefault: Boolean(p.shippingAddress.isDefault),
  } as Address;

  const billingAddress = {
    ...p.billingAddress,
    type: 'billing' as const,
    id: typeof p.billingAddress.id === 'string' ? p.billingAddress.id : '',
    userId: typeof p.billingAddress.userId === 'string' ? p.billingAddress.userId : '',
    isDefault: Boolean(p.billingAddress.isDefault),
  } as Address;

  return {
    items: cartItems,
    shippingAddress,
    billingAddress,
    paymentMethod: pm,
    userEmail: p.userEmail,
    couponCode: typeof p.couponCode === 'string' ? p.couponCode : null,
  };
}

export async function POST(request: NextRequest) {
  if (!keySecret || !keyId) {
    return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      createOrderPayload,
    } = body;

    if (!orderId || !paymentId || !signature || !createOrderPayload) {
      return NextResponse.json({ error: 'Missing payment details or order payload' }, { status: 400 });
    }

    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const payload = parseCreateOrderPayload(createOrderPayload);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const trusted = await computeTrustedOrderDraft({
      lines: orderLinesFromCartItems(payload.items),
      couponCode: payload.couponCode,
      country: payload.shippingAddress.country || 'IN',
    });
    if (!trusted.ok) {
      return NextResponse.json({ error: trusted.error }, { status: 400 });
    }

    const expectedPaise = Math.round(trusted.draft.total * 100);

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    let rzOrder: { amount?: number; currency?: string };
    try {
      rzOrder = (await rzp.orders.fetch(orderId)) as { amount?: number; currency?: string };
    } catch {
      return NextResponse.json({ error: 'Could not verify payment order' }, { status: 400 });
    }

    if ((rzOrder.currency || 'INR').toUpperCase() !== 'INR') {
      return NextResponse.json({ error: 'Invalid payment currency' }, { status: 400 });
    }

    if (Number(rzOrder.amount) !== expectedPaise) {
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 });
    }

    const result = await createOrder({
      ...payload,
      paymentMethod: 'razorpay',
      paymentId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      orderNumber: result.orderNumber,
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
