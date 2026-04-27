'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { validatePinCode } from '@/lib/utils/database';
import { analytics } from '@/lib/analytics';

export function PincodeDeliveryCheck() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    deliveryText: string;
    areaLabel: string;
    state: string;
  } | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const pc = pincode.trim();
    if (!validatePinCode(pc)) {
      setError('Enter a valid 6-digit PIN code');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/delivery-estimate?pincode=${encodeURIComponent(pc)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data?.error as string) || 'Could not check delivery');
        analytics.trackPincodeCheck(pc, false);
        return;
      }
      setResult({
        deliveryText: data.deliveryText as string,
        areaLabel: [data.areaName, data.district].filter(Boolean).join(', '),
        state: data.state as string,
      });
      analytics.trackPincodeCheck(pc, true, data.state as string);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <MapPin className="h-4 w-4 text-[#D32F2F]" aria-hidden />
        Delivery estimate
      </div>
      <p className="mb-3 text-xs text-gray-600">
        Enter your PIN code for an indicative delivery window (business days, order processing
        included).
      </p>
      <form onSubmit={check} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="product-pincode">
          PIN code
        </label>
        <input
          id="product-pincode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="e.g. 110001"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D32F2F] focus:outline-none focus:ring-1 focus:ring-[#D32F2F]"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Check
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-900">
          <p className="font-medium">Estimated delivery: {result.deliveryText}</p>
          <p className="mt-1 text-xs text-green-800">
            {result.areaLabel}
            {result.state ? ` · ${result.state}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
