// Database utility functions and helpers

import { Cart, CartItem } from '../types/database';

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cart: Cart, shippingCost: number = 0): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cart.couponCode ? calculateDiscount(subtotal, cart.couponCode) : 0;
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + tax + shippingCost;

  return {
    ...cart,
    subtotal,
    discount,
    tax,
    shipping: shippingCost,
    total
  };
}

/**
 * Calculate discount based on coupon code
 * This is a placeholder - implement actual coupon logic
 */
function calculateDiscount(subtotal: number, couponCode: string): number {
  // Placeholder logic
  const coupons: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
    'WELCOME10': { type: 'percentage', value: 10 },
    'FLAT50': { type: 'fixed', value: 50 },
    'FIRST100': { type: 'fixed', value: 100 }
  };

  const coupon = coupons[couponCode.toUpperCase()];
  if (!coupon) return 0;

  if (coupon.type === 'percentage') {
    return (subtotal * coupon.value) / 100;
  }
  return coupon.value;
}

/**
 * Calculate tax (GST in India)
 * Assuming 5% GST on spices
 */
function calculateTax(amount: number): number {
  return amount * 0.05; // 5% GST
}

/**
 * Calculate shipping cost based on cart total and location
 */
export function calculateShipping(subtotal: number, country: string = 'IN', state?: string): number {
  // Free shipping above ₹499 in India
  if (country === 'IN' && subtotal >= 499) {
    return 0;
  }

  // Domestic shipping
  if (country === 'IN') {
    return 40;
  }

  // International shipping (weight-based calculation would be better)
  return 500;
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EVR-${timestamp}-${random}`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toFixed(2)}`;
  }
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Validate cart item availability
 */
export function validateCartItem(item: CartItem, availableStock: number): { isValid: boolean; message?: string } {
  if (item.quantity <= 0) {
    return { isValid: false, message: 'Quantity must be greater than 0' };
  }

  if (item.quantity > availableStock) {
    return { isValid: false, message: `Only ${availableStock} units available` };
  }

  return { isValid: true };
}

/**
 * Merge cart items (combine same product + variant)
 */
export function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  items.forEach(item => {
    const key = `${item.productId}-${item.variantId}`;
    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity
      });
    } else {
      merged.set(key, { ...item });
    }
  });

  return Array.from(merged.values());
}

/**
 * Check if product is in stock
 */
export function isInStock(stock: number, minQuantity: number = 1): boolean {
  return stock >= minQuantity;
}

/**
 * Get stock status label
 */
export function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) {
    return { label: 'Out of Stock', color: 'red' };
  }
  if (stock < 10) {
    return { label: `Only ${stock} left`, color: 'orange' };
  }
  return { label: 'In Stock', color: 'green' };
}

/**
 * Calculate savings
 */
export function calculateSavings(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return compareAtPrice - price;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Validate Indian PIN code
 */
export function validatePinCode(pinCode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pinCode);
}

/**
 * Validate GST number (for B2B)
 */
export function validateGSTNumber(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

/**
 * Estimate delivery date
 */
export function estimateDeliveryDate(shippingMethod: 'standard' | 'express' = 'standard'): { min: Date; max: Date } {
  const today = new Date();
  const minDays = shippingMethod === 'express' ? 2 : 5;
  const maxDays = shippingMethod === 'express' ? 3 : 7;

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);

  return { min: minDate, max: maxDate };
}

/**
 * Format delivery date range
 */
export function formatDeliveryDate(min: Date, max: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${min.toLocaleDateString('en-IN', options)} - ${max.toLocaleDateString('en-IN', options)}`;
}

