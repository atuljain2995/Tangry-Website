import { NextRequest, NextResponse } from 'next/server';
import { computeTrustedOrderDraft } from '@/lib/orders/compute-trusted-order';

function parseCouponValidatePayload(raw: unknown): {
  couponCode: string;
  lines: { productId: string; variantId: string; quantity: number }[];
} | null {
  if (!raw || typeof raw !== 'object') return null;

  const body = raw as Record<string, unknown>;
  const couponCode = typeof body.couponCode === 'string' ? body.couponCode.trim() : '';
  const items = Array.isArray(body.items) ? body.items : null;

  if (!couponCode || !items?.length) return null;

  const lines: { productId: string; variantId: string; quantity: number }[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') return null;
    const row = item as Record<string, unknown>;
    if (
      typeof row.productId !== 'string' ||
      typeof row.variantId !== 'string' ||
      typeof row.quantity !== 'number'
    ) {
      return null;
    }
    lines.push({
      productId: row.productId,
      variantId: row.variantId,
      quantity: row.quantity,
    });
  }

  return { couponCode, lines };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseCouponValidatePayload(body);

    if (!parsed) {
      return NextResponse.json({ error: 'Invalid coupon request' }, { status: 400 });
    }

    const trusted = await computeTrustedOrderDraft({
      lines: parsed.lines,
      couponCode: parsed.couponCode,
      country: 'IN',
    });

    if (!trusted.ok) {
      return NextResponse.json({ error: trusted.error }, { status: 400 });
    }

    return NextResponse.json({
      couponCode: parsed.couponCode.toUpperCase(),
      subtotal: trusted.draft.subtotal,
      discount: trusted.draft.discount,
      total: trusted.draft.total,
    });
  } catch (error) {
    console.error('Coupon validate error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
