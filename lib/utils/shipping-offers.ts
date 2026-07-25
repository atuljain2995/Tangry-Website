import { SHIPPING } from '@/lib/data/shipping';

export type FreeShippingStatus = {
  /** Product total after discount — basis for free-shipping eligibility. */
  orderValue: number;
  qualifies: boolean;
  shippingFee: number;
  amountAway: number;
  /** 0–100 progress toward free shipping. */
  progressPercent: number;
  threshold: number;
};

/** Shared free-shipping progress for cart upsell UI. */
export function getFreeShippingStatus(
  orderValueAfterDiscount: number,
  country = 'IN',
): FreeShippingStatus {
  const threshold = SHIPPING.freeThresholdIn;
  const orderValue = Math.max(0, orderValueAfterDiscount);

  if (country !== 'IN') {
    return {
      orderValue,
      qualifies: false,
      shippingFee: 500,
      amountAway: 0,
      progressPercent: 0,
      threshold,
    };
  }

  const qualifies = orderValue >= threshold;
  const amountAway = qualifies ? 0 : threshold - orderValue;
  const progressPercent = qualifies ? 100 : Math.min(100, Math.round((orderValue / threshold) * 100));

  return {
    orderValue,
    qualifies,
    shippingFee: qualifies ? 0 : SHIPPING.flatRateIn,
    amountAway,
    progressPercent,
    threshold,
  };
}
