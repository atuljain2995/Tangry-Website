'use client';

import Link from 'next/link';
import { Truck, PartyPopper } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/database';
import { getFreeShippingStatus } from '@/lib/utils/shipping-offers';
import { SHIPPING, FREE_SHIPPING_LABEL } from '@/lib/data/shipping';

interface FreeShippingUpsellProps {
  orderValueAfterDiscount: number;
  country?: string;
  /** banner = cart drawer; compact = one-liner; inline = bill row helper */
  variant?: 'banner' | 'compact' | 'inline';
  onShopClick?: () => void;
  className?: string;
}

export function FreeShippingUpsell({
  orderValueAfterDiscount,
  country = 'IN',
  variant = 'banner',
  onShopClick,
  className = '',
}: FreeShippingUpsellProps) {
  const status = getFreeShippingStatus(orderValueAfterDiscount, country);

  if (country !== 'IN') return null;

  if (variant === 'compact') {
    return (
      <p className={`text-xs ${status.qualifies ? 'font-semibold text-green-700' : 'text-gray-500'} ${className}`}>
        {status.qualifies ? (
          <>Free delivery unlocked</>
        ) : (
          <>Add {formatCurrency(status.amountAway)} more for free delivery</>
        )}
      </p>
    );
  }

  if (variant === 'inline') {
    if (status.qualifies) {
      return (
        <span className={`inline-flex items-center gap-1 text-sm font-semibold text-green-700 ${className}`}>
          FREE
        </span>
      );
    }
    return (
      <span className={`text-xs text-gray-500 ${className}`}>
        {formatCurrency(status.shippingFee)} · {FREE_SHIPPING_LABEL.toLowerCase()}
      </span>
    );
  }

  // banner
  if (status.qualifies) {
    return (
      <div
        className={`rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <PartyPopper className="h-5 w-5 shrink-0 text-green-700" aria-hidden />
          <div>
            <p className="text-sm font-bold text-green-900">You&apos;ve unlocked free delivery!</p>
            <p className="text-xs text-green-700">Save {formatCurrency(SHIPPING.flatRateIn)} on this order</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-[#FFF8F3] px-3.5 py-3 ${className}`}
    >
      <div className="mb-2 flex items-start gap-2.5">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32F2F]" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">
            Add {formatCurrency(status.amountAway)} more for{' '}
            <span className="text-green-700">FREE delivery</span>
          </p>
          <p className="text-xs text-gray-600">{FREE_SHIPPING_LABEL}</p>
        </div>
      </div>

      <div className="mb-2 h-2 overflow-hidden rounded-full bg-orange-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#D32F2F] to-orange-400 transition-all duration-500"
          style={{ width: `${status.progressPercent}%` }}
          role="progressbar"
          aria-valuenow={status.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${status.progressPercent}% toward free delivery`}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <span>{formatCurrency(status.orderValue)}</span>
        <span>{formatCurrency(status.threshold)}</span>
      </div>

      <Link
        href="/products"
        onClick={onShopClick}
        className="mt-2.5 inline-block text-xs font-bold text-[#D32F2F] hover:underline"
      >
        Browse masalas to reach ₹{status.threshold} →
      </Link>
    </div>
  );
}

/** Format shipping line in price breakdowns. */
export function formatShippingLine(
  shipping: number,
  orderValueAfterDiscount: number,
  country = 'IN',
): { label: string; value: string; valueClassName?: string } {
  const status = getFreeShippingStatus(orderValueAfterDiscount, country);
  if (status.qualifies || shipping === 0) {
    return {
      label: 'Delivery',
      value: 'FREE',
      valueClassName: 'font-semibold text-green-700',
    };
  }
  return {
    label: 'Delivery (pan-India)',
    value: formatCurrency(shipping),
  };
}
