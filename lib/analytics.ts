/**
 * Google Analytics 4 utilities for Next.js
 */

import { CartItem } from '@/lib/types/database';
import {
  cartItemsToGa4,
  ga4ItemsValue,
  productToGa4Item,
} from '@/lib/utils/analytics-items';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const isAnalyticsEnabled = (): boolean => {
  return !!GA_MEASUREMENT_ID && process.env.NODE_ENV !== 'development';
};

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  label?: string;
  attribution?: Record<string, unknown>;
}

export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  if (!isAnalyticsEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.info('Web Vitals (dev):', metric);
    }
    return;
  }

  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);

  gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: metric.name,
    value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
  });
}

export function trackEvent(event: GAEvent): void {
  if (!isAnalyticsEnabled()) return;

  gtag('event', event.action, {
    event_category: event.category || 'engagement',
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  });
}

export function trackPageView(url: string, title?: string): void {
  if (!isAnalyticsEnabled()) return;

  gtag('event', 'page_view', {
    page_location: url,
    page_title: title,
  });
}

export const analytics = {
  trackExternalLink: (url: string, text?: string) =>
    trackEvent({
      action: 'click_external_link',
      category: 'engagement',
      label: url,
      custom_parameters: { link_text: text, link_url: url },
    }),

  trackFormSubmission: (formName: string, success = true) =>
    trackEvent({
      action: 'form_submission',
      category: 'engagement',
      label: formName,
      value: success ? 1 : 0,
      custom_parameters: { form_name: formName, submission_success: success },
    }),

  trackSearch: (query: string, results?: number) =>
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: query,
      value: results,
      custom_parameters: { search_term: query, search_results: results },
    }),

  // Ecommerce
  trackProductView: (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string,
    price: number,
  ) => {
    if (!isAnalyticsEnabled()) return;
    const items = [productToGa4Item({ productId, productName, variantId, variantName, price })];
    gtag('event', 'view_item', {
      currency: 'INR',
      value: ga4ItemsValue(items),
      items,
    });
  },

  trackAddToCart: (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string,
    quantity: number,
    price: number,
  ) => {
    if (!isAnalyticsEnabled()) return;
    const items = [
      productToGa4Item({ productId, productName, variantId, variantName, price, quantity }),
    ];
    gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: ga4ItemsValue(items),
      items,
    });
  },

  trackBeginCheckout: (cartItems: CartItem[], total: number, couponCode?: string) => {
    if (!isAnalyticsEnabled()) return;
    const items = cartItemsToGa4(cartItems);
    gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: total,
      coupon: couponCode,
      items,
    });
  },

  trackPurchase: (
    orderId: string,
    cartItems: CartItem[],
    total: number,
    couponCode?: string,
  ) => {
    if (!isAnalyticsEnabled()) return;
    const items = cartItemsToGa4(cartItems);
    gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'INR',
      value: total,
      coupon: couponCode,
      items,
    });
  },

  trackRemoveFromCart: (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string,
    quantity: number,
    price: number,
  ) => {
    if (!isAnalyticsEnabled()) return;
    const items = [
      productToGa4Item({ productId, productName, variantId, variantName, price, quantity }),
    ];
    gtag('event', 'remove_from_cart', {
      currency: 'INR',
      value: ga4ItemsValue(items),
      items,
    });
  },

  trackAuth: (
    event: 'login_success' | 'login_failed' | 'signup_success' | 'signup_failed' | 'logout',
  ) => trackEvent({ action: event, category: 'authentication' }),

  trackWishlist: (action: 'add' | 'remove', productId: string, productName: string) =>
    trackEvent({
      action: action === 'add' ? 'wishlist_add' : 'wishlist_remove',
      category: 'engagement',
      label: productName,
      custom_parameters: { product_id: productId },
    }),

  trackShare: (productId: string, productName: string, method: 'native' | 'clipboard') =>
    trackEvent({
      action: 'product_shared',
      category: 'engagement',
      label: productName,
      custom_parameters: { product_id: productId, share_method: method },
    }),

  trackCoupon: (action: 'applied' | 'removed' | 'error', code: string, discount?: number) =>
    trackEvent({
      action: `coupon_${action}`,
      category: 'promotion',
      label: code,
      value: discount,
    }),

  trackPincodeCheck: (pincode: string, available: boolean, state?: string) =>
    trackEvent({
      action: 'pincode_check',
      category: 'fulfillment',
      label: available ? 'available' : 'unavailable',
      custom_parameters: { pincode, delivery_available: available, state },
    }),

  trackFilter: (filterType: 'category' | 'sort', value: string) =>
    trackEvent({
      action: `filter_${filterType}`,
      category: 'navigation',
      label: value,
    }),

  trackVariantSelected: (
    productId: string,
    variantId: string,
    variantName: string,
    from: 'detail' | 'grid',
  ) =>
    trackEvent({
      action: 'variant_selected',
      category: 'product_view',
      label: variantName,
      custom_parameters: { product_id: productId, variant_id: variantId, from_view: from },
    }),

  trackReview: (productId: string, rating: number, success: boolean, errorMsg?: string) =>
    trackEvent({
      action: success ? 'review_submitted' : 'review_error',
      category: 'engagement',
      label: productId,
      value: success ? rating : 0,
      custom_parameters: success ? { rating } : { error: errorMsg },
    }),

  trackCheckoutError: (paymentMethod: string, errorMsg: string) =>
    trackEvent({
      action: 'checkout_error',
      category: 'checkout',
      label: paymentMethod,
      custom_parameters: { payment_method: paymentMethod, error: errorMsg },
    }),

  trackExternalMarketplace: (marketplace: string, url: string) =>
    trackEvent({
      action: 'click_external_marketplace',
      category: 'engagement',
      label: marketplace,
      custom_parameters: { link_url: url },
    }),

  trackWhatsAppClick: (sourcePath: string) =>
    trackEvent({
      action: 'click_whatsapp',
      category: 'lead_generation',
      label: sourcePath,
      custom_parameters: { source_path: sourcePath },
    }),
};
