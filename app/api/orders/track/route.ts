import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

// ── POST /api/orders/track ────────────────────────────────────────────────────
// Public guest order-status lookup. Requires BOTH the order number and the email
// used at checkout to match — a single generic error is returned on any mismatch
// so this can't be used to enumerate order numbers or confirm which emails placed orders.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { orderNumber, email } = body as Record<string, unknown>;
  const number = typeof orderNumber === 'string' ? orderNumber.trim().toUpperCase() : '';
  const mail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!number || !mail) {
    return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 });
  }

  const NOT_FOUND = {
    error: "We couldn't find an order with that number and email. Double-check both and try again.",
  };

  const { orders } = schema;
  let order: unknown;
  try {
    [order] = await getDb()
      .select({
        order_number: orders.order_number,
        order_status: orders.order_status,
        payment_status: orders.payment_status,
        payment_method: orders.payment_method,
        total: orders.total,
        currency: orders.currency,
        items: orders.items,
        tracking_number: orders.tracking_number,
        created_at: orders.created_at,
        user_email: orders.user_email,
        shipping_address: orders.shipping_address,
      })
      .from(orders)
      .where(eq(orders.order_number, number))
      .limit(1);
  } catch (error) {
    console.error('order track lookup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  const o = order as {
    order_number: string;
    order_status: string;
    payment_status: string;
    payment_method: string;
    total: number;
    currency: string;
    items: unknown;
    tracking_number: string | null;
    created_at: string;
    user_email: string;
    shipping_address: { city?: string; state?: string } | null;
  } | null;

  if (!o || o.user_email?.trim().toLowerCase() !== mail) {
    return NextResponse.json(NOT_FOUND, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: o.order_number,
    orderStatus: o.order_status,
    paymentStatus: o.payment_status,
    paymentMethod: o.payment_method,
    total: o.total,
    currency: o.currency,
    items: o.items,
    trackingNumber: o.tracking_number,
    createdAt: o.created_at,
    deliveryCity: o.shipping_address?.city ?? null,
    deliveryState: o.shipping_address?.state ?? null,
  });
}
