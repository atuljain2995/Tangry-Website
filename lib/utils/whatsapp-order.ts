import type { Cart } from '@/lib/types/database';
import { formatCurrency } from '@/lib/utils/database';

/** WhatsApp Business number (digits only, country code included). */
const WA_DIGITS = '917733009952';

/**
 * Builds a wa.me URL with a pre-filled order message from the current cart.
 */
export function buildWhatsAppOrderUrl(cart: Cart): string | null {
  if (!cart.items.length) return null;

  const lines = cart.items.map(
    (i) =>
      `• ${i.productName} (${i.variantName}) × ${i.quantity} — ${formatCurrency(i.price * i.quantity)}`,
  );

  const parts = [
    'Hi Tangry! I would like to place an order from my cart on your website:',
    '',
    ...lines,
    '',
    `Subtotal: ${formatCurrency(cart.subtotal)}`,
    cart.discount > 0 ? `Discount: -${formatCurrency(cart.discount)}` : '',
    `Estimated total shown: ${formatCurrency(cart.total)} (please confirm final amount, shipping & GST).`,
    '',
    'Please confirm availability and how to pay (COD / UPI). Thank you!',
  ].filter(Boolean) as string[];

  return `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(parts.join('\n'))}`;
}
