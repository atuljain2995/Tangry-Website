/**
 * Google Analytics 4 utilities for Next.js
 * Using @next/third-parties/google
 */

import { sendGAEvent } from '@next/third-parties/google';

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

  sendGAEvent('event', 'web_vitals', {
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

  sendGAEvent('event', event.action, {
    event_category: event.category || 'engagement',
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  });
}

export function trackPageView(url: string, title?: string): void {
  if (!isAnalyticsEnabled()) return;

  sendGAEvent('event', 'page_view', {
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
  trackProductView: (productId: string, productName: string, price: number) => {
    if (!isAnalyticsEnabled()) return;
    sendGAEvent('event', 'view_item', {
      currency: 'INR',
      value: price,
      items: [{ item_id: productId, item_name: productName, price }],
    });
  },

  trackAddToCart: (productId: string, productName: string, quantity: number, price: number) => {
    if (!isAnalyticsEnabled()) return;
    sendGAEvent('event', 'add_to_cart', {
      currency: 'INR',
      value: price * quantity,
      items: [{ item_id: productId, item_name: productName, quantity, price }],
    });
  },

  trackBeginCheckout: (total: number, itemCount: number) => {
    if (!isAnalyticsEnabled()) return;
    sendGAEvent('event', 'begin_checkout', {
      currency: 'INR',
      value: total,
      items: [{ item_id: 'checkout', item_name: 'Checkout', quantity: itemCount, price: total }],
    });
  },

  trackPurchase: (orderId: string, total: number, items: number) => {
    if (!isAnalyticsEnabled()) return;
    sendGAEvent('event', 'purchase', {
      transaction_id: orderId,
      currency: 'INR',
      value: total,
      items: [{ item_id: orderId, item_name: 'Order', quantity: items, price: total }],
    });
  },
};
