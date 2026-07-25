import type { Cart } from '@/lib/types/database';
import { calculateShipping } from '@/lib/utils/database';

export type CheckoutTotals = {
  subtotal: number;
  discount: number;
  afterDiscount: number;
  shipping: number;
  grandTotal: number;
  itemCount: number;
};

/** Client-side checkout totals aligned with server `computeTrustedOrderDraft`. */
export function getCheckoutTotals(cart: Cart, country = 'IN'): CheckoutTotals {
  const subtotal = cart.subtotal;
  const discount = cart.discount ?? 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(afterDiscount, country);
  const grandTotal = afterDiscount + shipping;
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return { subtotal, discount, afterDiscount, shipping, grandTotal, itemCount };
}
