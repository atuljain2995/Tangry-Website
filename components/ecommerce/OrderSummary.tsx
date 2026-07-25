'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils/database';
import { getCheckoutTotals } from '@/lib/utils/checkout-totals';
import {
  Tag,
  Trash2,
  ChevronDown,
  ChevronUp,
  Truck,
  ShoppingBag,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import { ProductImage } from './ProductImage';
import { FreeShippingUpsell, formatShippingLine } from './FreeShippingUpsell';
import { FREE_SHIPPING_LABEL } from '@/lib/data/shipping';

interface OrderSummaryProps {
  showCouponField?: boolean;
  /** Mobile: collapsible breakdown sheet */
  collapsibleOnMobile?: boolean;
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#D32F2F]" aria-hidden />
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{children}</h3>
    </div>
  );
}

export const OrderSummary = ({
  showCouponField = true,
  collapsibleOnMobile = false,
}: OrderSummaryProps) => {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const { subtotal, discount, afterDiscount, shipping, grandTotal, itemCount } =
    getCheckoutTotals(cart);

  const shippingLine = formatShippingLine(shipping, afterDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (!cart.items.length) {
      setCouponError('Your cart is empty');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        couponCode?: string;
        discount?: number;
      };

      if (!res.ok || typeof data.discount !== 'number') {
        setCouponError(data.error || 'Failed to apply coupon');
        analytics.trackCoupon('error', couponCode.trim());
        return;
      }

      applyCoupon(data.couponCode || couponCode, data.discount);
      analytics.trackCoupon('applied', data.couponCode || couponCode, data.discount);
    } catch {
      setCouponError('Network error while validating coupon');
      return;
    } finally {
      setIsApplyingCoupon(false);
    }

    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    analytics.trackCoupon('removed', cart.couponCode ?? '', cart.discount);
    removeCoupon();
  };

  const priceBreakdown = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? 'space-y-2.5 rounded-xl bg-[#FFF8F3] p-3.5' : 'space-y-2'}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-green-700">Coupon discount</span>
          <span className="font-semibold text-green-700">−{formatCurrency(discount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          {compact && <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          {shippingLine.label}
        </span>
        <span className={`font-medium ${shippingLine.valueClassName ?? 'text-gray-900'}`}>
          {shippingLine.value}
        </span>
      </div>
      {!compact && !shippingLine.valueClassName && (
        <p className="text-xs text-gray-500">{FREE_SHIPPING_LABEL}</p>
      )}
    </div>
  );

  const couponSection = (variant: 'desktop' | 'mobile' = 'desktop') => {
    if (!showCouponField) return null;

    const wrapperClass = variant === 'mobile' ? 'rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-3.5' : 'mb-5';

    return (
      <div className={wrapperClass}>
        {cart.couponCode && cart.discount > 0 ? (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" aria-hidden />
              <div>
                <span className="text-sm font-semibold text-green-700">{cart.couponCode}</span>
                <p className="text-xs text-green-600">You save {formatCurrency(discount)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
              aria-label="Remove coupon"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div>
            {variant === 'mobile' && (
              <p className="mb-2 text-xs font-semibold text-gray-700">Have a coupon?</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCouponError('');
                }}
                placeholder="Enter code"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
                className="rounded-xl bg-[#D32F2F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B71C1C] disabled:opacity-60"
              >
                {isApplyingCoupon ? '…' : 'Apply'}
              </button>
            </div>
            {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
            <button
              type="button"
              onClick={() => {
                setCouponCode('TANGRY10');
                setCouponError('');
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 transition hover:text-[#D32F2F]"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              First order? Try <span className="font-bold">TANGRY10</span> for 10% off
            </button>
          </div>
        )}
      </div>
    );
  };

  const itemsList = (variant: 'desktop' | 'mobile' = 'desktop') => (
    <div
      className={
        variant === 'mobile'
          ? 'space-y-2.5'
          : 'mb-5 max-h-52 space-y-3 overflow-y-auto'
      }
    >
      {cart.items.map((item) => {
        const lineTotal = item.price * item.quantity;
        return (
          <div
            key={`${item.productId}-${item.variantId}`}
            className={
              variant === 'mobile'
                ? 'flex gap-3 rounded-xl border border-orange-100/80 bg-[#FFFCFA] p-3'
                : 'flex gap-3'
            }
          >
            <div
              className={`relative shrink-0 overflow-hidden rounded-xl bg-orange-50 ${
                variant === 'mobile' ? 'h-16 w-16' : 'h-14 w-14'
              }`}
            >
              {item.image ? (
                <ProductImage
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes={variant === 'mobile' ? '64px' : '56px'}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                  No image
                </div>
              )}
              {variant === 'mobile' && item.quantity > 1 && (
                <span className="absolute bottom-0 right-0 rounded-tl-lg bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  ×{item.quantity}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                {item.productName}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">{item.variantName}</p>
              <div className="mt-1.5 flex items-end justify-between gap-2">
                {variant === 'mobile' ? (
                  <p className="text-xs text-gray-500">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                ) : (
                  <span className="text-xs text-gray-500">Qty {item.quantity}</span>
                )}
                <span className="shrink-0 text-sm font-bold text-gray-900">
                  {formatCurrency(lineTotal)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const totalFooter = (size: 'mobile' | 'desktop') => (
    <>
      <div
        className={`flex items-center justify-between ${
          size === 'mobile' ? 'rounded-xl bg-gray-900 px-4 py-3.5 text-white' : ''
        }`}
      >
        <div>
          <span
            className={`font-bold ${size === 'mobile' ? 'text-sm text-white/80' : 'text-lg text-gray-900'}`}
          >
            {size === 'mobile' ? 'Amount payable' : 'Total'}
          </span>
          {size === 'mobile' && (
            <p className="text-[11px] text-white/60">Incl. GST · delivery included</p>
          )}
        </div>
        <div className="text-right">
          {discount > 0 && size === 'mobile' && (
            <p className="text-xs text-white/50 line-through">{formatCurrency(subtotal + shipping)}</p>
          )}
          <span
            className={`font-bold ${
              size === 'mobile' ? 'text-xl text-white' : 'text-2xl text-[#D32F2F]'
            }`}
          >
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>
      {size === 'desktop' && (
        <p className="mt-1 text-right text-xs text-gray-500">Inclusive of 5% GST</p>
      )}
      {discount > 0 && (
        <p
          className={`mt-2 text-right text-sm font-semibold text-green-600 ${
            size === 'mobile' ? 'rounded-lg bg-green-50 px-3 py-2 text-center' : ''
          }`}
        >
          🎉 You&apos;re saving {formatCurrency(discount)} on this order
        </p>
      )}
    </>
  );

  if (collapsibleOnMobile) {
    return (
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          aria-expanded={mobileExpanded}
          className="flex w-full items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-orange-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8F3]">
            <ShoppingBag className="h-5 w-5 text-[#D32F2F]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Order summary
            </p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
            <FreeShippingUpsell
              orderValueAfterDiscount={afterDiscount}
              variant="compact"
            />
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            {mobileExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden />
            )}
            <span className="text-[10px] font-medium text-gray-400">
              {mobileExpanded ? 'Hide' : 'View'}
            </span>
          </div>
        </button>

        {mobileExpanded && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="border-b border-orange-100 px-4 py-3">
              <SectionLabel icon={ShoppingBag}>
                In your bag ({itemCount})
              </SectionLabel>
              {itemsList('mobile')}
            </div>

            {showCouponField && (
              <div className="border-b border-orange-100 px-4 py-3">
                <SectionLabel icon={Tag}>Offers</SectionLabel>
                {couponSection('mobile')}
              </div>
            )}

            <div className="px-4 py-3">
              <SectionLabel icon={Receipt}>Bill details</SectionLabel>
              <FreeShippingUpsell
                orderValueAfterDiscount={afterDiscount}
                variant="banner"
                className="mb-3"
              />
              {priceBreakdown({ compact: true })}
            </div>

            <div className="border-t border-orange-100 px-4 py-3">
              {totalFooter('mobile')}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-24 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Order summary</h2>
      <FreeShippingUpsell
        orderValueAfterDiscount={afterDiscount}
        variant="banner"
        className="mb-4"
      />
      {itemsList('desktop')}
      {couponSection('desktop')}
      <div className="mb-4 border-b border-orange-100 pb-4">{priceBreakdown({ compact: false })}</div>
      {totalFooter('desktop')}
    </div>
  );
};
