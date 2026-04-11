'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Checkout Error</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Something went wrong during checkout. Your order has not been placed.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-[#D32F2F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#B71C1C] transition"
        >
          Try Again
        </button>
        <Link
          href="/products"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
