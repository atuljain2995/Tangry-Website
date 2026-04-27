'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency, calculateShipping } from '@/lib/utils/database';
import { Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import { ProductImage } from './ProductImage';

interface OrderSummaryProps {
  showCouponField?: boolean;
  showShipping?: boolean;
}

export const OrderSummary = ({
  showCouponField = true,
  showShipping = false,
}: OrderSummaryProps) => {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

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

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex space-x-3">
            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative">
              {item.image ? (
                <ProductImage
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{item.productName}</h3>
              <p className="text-xs text-gray-500">{item.variantName}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      {showCouponField && (
        <div className="mb-6">
          {cart.couponCode && cart.discount > 0 ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center space-x-2">
                <Tag size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  {cart.couponCode} Applied
                </span>
              </div>
              <button onClick={handleRemoveCoupon} className="text-red-600 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-600 text-xs mt-1">{couponError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
          <span className="font-medium text-gray-900">{formatCurrency(cart.subtotal)}</span>
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="font-medium text-green-600">-{formatCurrency(cart.discount)}</span>
          </div>
        )}

        {showShipping && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(calculateShipping(cart.subtotal - cart.discount))}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-[#D32F2F]">
          {formatCurrency(
            showShipping
              ? cart.total + calculateShipping(cart.subtotal - cart.discount)
              : cart.total,
          )}
        </span>
      </div>
      <p className="text-xs text-gray-500 text-right mt-1">Inclusive of 5% GST</p>

      {/* Savings */}
      {cart.discount > 0 && (
        <p className="text-sm text-green-600 font-semibold mt-2 text-right">
          You saved {formatCurrency(cart.discount)}!
        </p>
      )}
    </div>
  );
};
