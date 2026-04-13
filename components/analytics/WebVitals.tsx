'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, type WebVitalsMetric } from '@/lib/analytics';

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric as unknown as WebVitalsMetric);
  });
  return null;
}
