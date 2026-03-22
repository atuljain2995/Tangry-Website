/**
 * Descriptive alt text for product images (SEO / accessibility).
 */
export function productImageAlt(productName: string, variantLabel?: string): string {
  const v = variantLabel?.trim();
  if (v) {
    return `${productName} ${v} — Tangry Spices pouch, Jaipur`;
  }
  return `${productName} — Tangry Spices, Jaipur`;
}
