'use client';

import { useEffect, useState } from 'react';
import { Truck, Loader2 } from 'lucide-react';

type DeliveryHint = {
  minDays: number;
  maxDays: number;
  arriveBy: string;
  areaLabel: string;
};

export function CheckoutDeliveryHint({ pincode }: { pincode?: string }) {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<DeliveryHint | null>(null);

  const normalizedPin = pincode?.replace(/\D/g, '').slice(0, 6) ?? '';

  useEffect(() => {
    if (normalizedPin.length !== 6) return;

    let cancelled = false;
    /* eslint-disable react-hooks/set-state-in-effect -- fetching delivery estimate for PIN */
    setLoading(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    fetch(`/api/delivery-estimate?pincode=${encodeURIComponent(normalizedPin)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('lookup failed'))))
      .then((data) => {
        if (cancelled) return;
        setHint({
          minDays: data.minDays,
          maxDays: data.maxDays,
          arriveBy: data.arriveBy,
          areaLabel: [data.areaName, data.district].filter(Boolean).join(', '),
        });
      })
      .catch(() => {
        if (!cancelled) setHint(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedPin]);

  const displayHint = normalizedPin.length === 6 ? hint : null;

  if (normalizedPin.length !== 6) {
    return (
      <p className="mt-3 text-xs text-gray-500">
        Enter PIN code above for delivery estimate · ₹80 shipping across India
      </p>
    );
  }

  if (loading) {
    return (
      <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Checking delivery…
      </p>
    );
  }

  if (!displayHint) {
    return (
      <p className="mt-3 text-xs text-gray-500">
        Enter PIN code above for delivery estimate · ₹80 shipping across India
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-xs text-green-900">
      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden />
      <div>
        <p className="font-semibold">
          Delivery in {displayHint.minDays}–{displayHint.maxDays} business days
        </p>
        <p className="mt-0.5 text-green-800">
          By {displayHint.arriveBy}
          {displayHint.areaLabel ? ` · ${displayHint.areaLabel}` : ''}
        </p>
      </div>
    </div>
  );
}
