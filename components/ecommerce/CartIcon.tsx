'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

export const CartIcon = () => {
  const { cartItemCount, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Defer badge until after hydration so server (0 items) matches first client paint.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount gate
    setMounted(true);
  }, []);

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-gray-700 transition hover:text-[#D32F2F] dark:text-neutral-200 dark:hover:text-orange-400"
      aria-label="Open shopping cart"
    >
      <ShoppingBag size={24} />
      {mounted && cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </span>
      )}
    </button>
  );
};
