import { CartItem } from '@/lib/types/database';
import { formatCurrency } from '@/lib/utils/database';

function isGenericVariantName(name: string | undefined): boolean {
  const trimmed = name?.trim();
  return !trimmed || /^default$/i.test(trimmed);
}

/** Subtitle under product name — variant / unit price only (qty lives in the stepper). */
export function formatCartItemSubtitle(item: CartItem): string | null {
  const variant = item.variantName?.trim();

  if (isGenericVariantName(variant)) {
    return item.quantity > 1 ? `${formatCurrency(item.price)} each` : null;
  }

  if (item.quantity > 1) {
    return `${variant} · ${formatCurrency(item.price)} each`;
  }

  return variant!;
}
