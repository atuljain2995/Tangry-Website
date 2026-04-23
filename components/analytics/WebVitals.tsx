'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, type WebVitalsMetric } from '@/lib/analytics';

// Fire-and-forget beacon to /api/vitals.
// Runs independently of GA4 so CWV data is always captured, even when
// NEXT_PUBLIC_GA_ID is not set (dev, staging, or analytics-blocked browsers).
function beaconVital(metric: WebVitalsMetric) {
  const url = typeof window !== 'undefined' ? window.location.pathname : '/';
  const payload = JSON.stringify({
    url,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    delta: metric.delta,
    navigationType:
      (metric.attribution as Record<string, unknown> | undefined)
        ?.navigationType ?? null,
  });

  // Use sendBeacon when available (survives page unload), fall back to fetch.
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', new Blob([payload], { type: 'application/json' }));
  } else {
    fetch('/api/vitals', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {/* non-critical */});
  }
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    const typed = metric as unknown as WebVitalsMetric;
    reportWebVitals(typed);   // GA4
    beaconVital(typed);       // first-party RUM store
  });
  return null;
}
