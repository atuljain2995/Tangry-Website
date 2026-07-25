'use client';

import { Check } from 'lucide-react';

type CheckoutStep = 'shipping' | 'payment';

const STEPS: { id: CheckoutStep; label: string; subtitle: string }[] = [
  { id: 'shipping', label: 'Address', subtitle: 'Where should we deliver?' },
  { id: 'payment', label: 'Payment', subtitle: 'Choose how to pay' },
];

export function CheckoutStepper({ currentStep }: { currentStep: CheckoutStep }) {
  const activeIndex = STEPS.findIndex((s) => s.id === currentStep);
  const active = STEPS[activeIndex];

  return (
    <div className="mb-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
        Step {activeIndex + 1} of 2
      </p>
      <p className="text-center text-sm text-gray-700 mb-5">{active.subtitle}</p>

      <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
        {STEPS.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                    isComplete
                      ? 'bg-green-600 text-white'
                      : isActive
                        ? 'bg-[#D32F2F] text-white shadow-md'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isComplete ? <Check className="h-5 w-5" aria-hidden /> : index + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-semibold ${
                    isActive ? 'text-[#D32F2F]' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mb-5 h-0.5 w-12 sm:w-20 rounded ${isComplete ? 'bg-green-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
