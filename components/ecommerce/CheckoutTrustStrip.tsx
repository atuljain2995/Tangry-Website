import { Shield, Truck, RotateCcw } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/constants';

export function CheckoutTrustStrip({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Shield className="h-3 w-3 text-[#D32F2F]" aria-hidden />
          Secured by Razorpay
        </span>
        <span>FSSAI licensed</span>
        <span>7-day returns</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 mb-3">
        {['UPI', 'GPay', 'PhonePe', 'Cards', 'COD'].map((label) => (
          <span
            key={label}
            className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-700"
          >
            {label}
          </span>
        ))}
      </div>
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <Shield className="h-4 w-4 shrink-0 text-[#D32F2F]" aria-hidden />
          256-bit encrypted checkout via Razorpay
        </li>
        <li className="flex items-center gap-2">
          <Truck className="h-4 w-4 shrink-0 text-[#D32F2F]" aria-hidden />
          Pan-India delivery from Jaipur
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 shrink-0 text-[#D32F2F]" aria-hidden />
          {COMPANY_INFO.certifications[0]} · Easy returns
        </li>
      </ul>
    </div>
  );
}
