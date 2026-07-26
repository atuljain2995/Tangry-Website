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
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import { CartItem } from '@/lib/types/database';
import { ProductImage } from './ProductImage';
import { FreeShippingUpsell, formatShippingLine } from './FreeShippingUpsell';
import { FREE_SHIPPING_LABEL } from '@/lib/data/shipping';
import { formatCartItemSubtitle } from '@/lib/utils/cart-display';

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

function OrderSummaryLineItem({
  item,
  variant,
}: {
  item: CartItem;
  variant: 'desktop' | 'mobile';
}) {
  const { updateQuantity, removeFromCart } = useCart();
  const lineTotal = item.price * item.quantity;
  const subtitle = formatCartItemSubtitle(item);

  const handleIncrease = () => {
    updateQuantity(item.productId, item.variantId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.variantId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    analytics.trackRemoveFromCart(
      item.productId,
      item.productName,
      item.variantId,
      item.variantName,
      item.quantity,
      item.price,
    );
    removeFromCart(item.productId, item.variantId);
  };

  return (
    <div
      className={
        variant === 'mobile'
          ? 'rounded-xl border border-orange-100/80 bg-[#FFFCFA] p-3'
          : 'py-3 first:pt-0 last:pb-0'
      }
    >
      <div className="flex gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-50">
          {item.image ? (
            <ProductImage
              src={item.image}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Name + line total — primary scan line */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
              {item.productName}
            </h3>
            <span className="shrink-0 text-sm font-bold tabular-nums text-gray-900">
              {formatCurrency(lineTotal)}
            </span>
          </div>

          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

          {/* Actions: qty left, remove right */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Qty</span>
              <div className="inline-flex items-center overflow-hidden rounded-lg border border-orange-200 bg-white">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                  className="px-2 py-1 text-gray-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="min-w-[1.75rem] border-x border-orange-200 py-1 text-center text-xs font-semibold tabular-nums text-gray-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="px-2 py-1 text-gray-600 transition hover:bg-orange-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-medium text-gray-400 underline-offset-2 transition hover:text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
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
          ? 'space-y-2'
          : 'mb-4 max-h-64 divide-y divide-orange-100/80 overflow-y-auto pr-1'
      }
    >
      {cart.items.map((item) => (
        <OrderSummaryLineItem
          key={`${item.productId}-${item.variantId}`}
          item={item}
          variant={variant}
        />
      ))}
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
