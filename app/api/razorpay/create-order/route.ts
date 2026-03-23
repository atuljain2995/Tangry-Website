import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { computeTrustedOrderDraft } from '@/lib/orders/compute-trusted-order';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

function parseCartLines(body: { items?: unknown }): { productId: string; variantId: string; quantity: number }[] | null {
  const raw = body.items;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const lines: { productId: string; variantId: string; quantity: number }[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') return null;
    const o = row as Record<string, unknown>;
    const productId = typeof o.productId === 'string' ? o.productId : null;
    const variantId = typeof o.variantId === 'string' ? o.variantId : null;
    const quantity = typeof o.quantity === 'number' ? o.quantity : Number(o.quantity);
    if (!productId || !variantId || !Number.isFinite(quantity)) return null;
    lines.push({ productId, variantId, quantity });
  }
  return lines;
}

/**
 * POST /api/razorpay/create-order
 * Body: { items: { productId, variantId, quantity }[], couponCode?, country? }
 * Amount is computed server-side from DB prices (client totals are ignored).
 */
export async function POST(request: NextRequest) {
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const lines = parseCartLines(body);
    if (!lines) {
      return NextResponse.json({ error: 'Invalid cart' }, { status: 400 });
    }

    const couponCode = typeof body.couponCode === 'string' ? body.couponCode : null;
    const country = typeof body.country === 'string' ? body.country : 'IN';

    const trusted = await computeTrustedOrderDraft({
      lines,
      couponCode,
      country,
    });
    if (!trusted.ok) {
      return NextResponse.json({ error: trusted.error }, { status: 400 });
    }

    const amountInPaise = Math.round(trusted.draft.total * 100);
    if (amountInPaise <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcp_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      keyId,
      amountPaise: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
