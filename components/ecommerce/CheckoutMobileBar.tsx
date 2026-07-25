'use client';

import { formatCurrency } from '@/lib/utils/database';
import { Loader2 } from 'lucide-react';

interface CheckoutMobileBarProps {
  grandTotal: number;
  itemCount: number;
  step: 'shipping' | 'payment';
  isProcessing?: boolean;
  formId: string;
  ctaLabel: string;
}

export function CheckoutMobileBar({
  grandTotal,
  itemCount,
  step,
  isProcessing = false,
  formId,
  ctaLabel,
}: CheckoutMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-orange-100 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
            {step === 'shipping' ? 'Step 1 of 2 · Address' : 'Step 2 of 2 · Payment'}
          </p>
          <p className="text-xl font-bold text-gray-900 leading-tight">
            {formatCurrency(grandTotal)}
          </p>
          <p className="text-xs text-gray-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · incl. shipping & GST
          </p>
        </div>
        <button
          type="submit"
          form={formId}
          disabled={isProcessing}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D32F2F] px-5 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#B71C1C] transition disabled:opacity-60 min-w-[140px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Wait…
            </>
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </div>
  );
}
