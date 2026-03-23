import { validateCouponAndGetDiscount, resolveOrderLineItems, type OrderLineInput } from '@/lib/db/queries';
import { calculateShipping, calculateTax } from '@/lib/utils/database';
import type { CartItem } from '@/lib/types/database';

export type TrustedOrderDraft = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponId?: string;
  tax: number;
  shipping: number;
  total: number;
};

/** Server-authoritative cart totals for checkout and Razorpay (ignores client-reported prices). */
export async function computeTrustedOrderDraft(input: {
  lines: OrderLineInput[];
  couponCode?: string | null;
  country?: string;
}): Promise<{ ok: true; draft: TrustedOrderDraft } | { ok: false; error: string }> {
  const resolved = await resolveOrderLineItems(input.lines);
  if (!resolved.ok) return resolved;

  const { items } = resolved;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  let couponId: string | undefined;
  if (input.couponCode?.trim()) {
    const couponResult = await validateCouponAndGetDiscount(input.couponCode.trim(), subtotal);
    if ('error' in couponResult) {
      return { ok: false, error: couponResult.error };
    }
    discount = couponResult.discount;
    couponId = couponResult.couponId;
  }

  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount);
  const shipping = calculateShipping(afterDiscount, input.country?.trim() || 'IN');
  const total = afterDiscount + tax + shipping;

  return {
    ok: true,
    draft: {
      items,
      subtotal,
      discount,
      couponId,
      tax,
      shipping,
      total,
    },
  };
}

export function orderLinesFromCartItems(
  items: { productId: string; variantId: string; quantity: number }[]
): OrderLineInput[] {
  return items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity,
  }));
}
