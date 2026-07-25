'use client';

import { useState } from 'react';
import { Banknote, Loader2, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '@/lib/types/database';
import {
  PaymentBrandIcon,
  PaymentLogoStrip,
  type PaymentBrandId,
} from './PaymentBrandLogos';

interface PaymentOptionsProps {
  onSubmit: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  isProcessing?: boolean;
  error?: string | null;
  onDismissError?: () => void;
  formId?: string;
}

export const PaymentOptions = ({
  onSubmit,
  onBack,
  isProcessing = false,
  error = null,
  onDismissError,
  formId = 'checkout-payment-form',
}: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');

  const submitLabel = selectedMethod === 'razorpay' ? 'Pay securely' : 'Place order (COD)';

  const paymentMethods: {
    id: PaymentMethod;
    name: string;
    description: string;
    brands: PaymentBrandId[];
    icon: typeof Banknote;
    available: boolean;
    recommended: boolean;
  }[] = [
    {
      id: 'razorpay',
      name: 'Pay online',
      description: 'UPI, cards & wallets — instant confirmation',
      brands: ['upi', 'gpay', 'phonepe', 'paytm', 'visa', 'mastercard', 'rupay'],
      icon: ShieldCheck,
      available: true,
      recommended: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your masalas arrive · ₹0 extra',
      brands: ['cod'],
      icon: Banknote,
      available: true,
      recommended: false,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMethod);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{error}</p>
            {onDismissError && (
              <button
                type="button"
                onClick={onDismissError}
                className="shrink-0 font-semibold text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 text-xl font-bold text-gray-900">How would you like to pay?</h2>
        <p className="mb-4 text-sm text-gray-500">UPI is the fastest way to checkout in India</p>

        <PaymentLogoStrip
          brands={['upi', 'gpay', 'phonepe', 'paytm', 'visa', 'mastercard', 'rupay']}
          className="mb-5"
        />

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              disabled={!method.available || isProcessing}
              className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                selectedMethod === method.id
                  ? 'border-[#D32F2F] bg-red-50/60 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${!method.available ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-xl p-2.5 ${
                    selectedMethod === method.id
                      ? 'bg-[#D32F2F] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <method.icon size={22} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900">{method.name}</h3>
                    {method.recommended && (
                      <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600">{method.description}</p>
                </div>
                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-[#D32F2F] bg-[#D32F2F]'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-xs text-gray-600">
          <PaymentBrandIcon brand="razorpay" size="sm" />
          <span>
            Payments processed securely by <span className="font-semibold text-[#072654]">Razorpay</span>
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#D32F2F] focus:ring-[#D32F2F]"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the Terms &amp; Conditions and{' '}
          <a href="/privacy-policy" className="font-semibold text-[#D32F2F] hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      <div className="hidden items-center justify-between border-t border-orange-100 pt-6 lg:flex">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-2xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#D32F2F] px-8 py-3 font-bold text-white shadow-lg transition hover:bg-[#B71C1C] disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Processing…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};
