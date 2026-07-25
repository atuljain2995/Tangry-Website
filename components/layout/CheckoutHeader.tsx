'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle } from 'lucide-react';

interface CheckoutHeaderProps {
  itemCount?: number;
}

export function CheckoutHeader({ itemCount = 0 }: CheckoutHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-[#FFF8F3]/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#D32F2F] transition"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Back</span>
        </button>

        <Link href="/" className="flex flex-col items-center">
          <Image
            src="/images/logo-full.png"
            alt="Tangry Spices"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-0.5">
            Secure checkout
          </span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#D32F2F] transition"
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Help</span>
        </Link>
      </div>
      {itemCount > 0 && (
        <p className="border-t border-orange-100/60 bg-white/60 text-center text-xs text-gray-500 py-1.5">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
        </p>
      )}
    </header>
  );
}
