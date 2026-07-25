/** Domestic shipping rules — keep client and server in sync via `calculateShipping`. */
export const SHIPPING = {
  /** Flat rate when order value is below the free-shipping threshold (IN). */
  flatRateIn: 80,
  /** Free delivery when product total (after coupon) reaches this amount (IN). */
  freeThresholdIn: 500,
} as const;

export const FREE_SHIPPING_LABEL = `Free delivery on orders above ₹${SHIPPING.freeThresholdIn}`;
