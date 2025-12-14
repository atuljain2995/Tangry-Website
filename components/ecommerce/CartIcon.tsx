'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

export const CartIcon = () => {
  const { cartItemCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-gray-700 hover:text-[#D32F2F] transition"
      aria-label="Open shopping cart"
    >
      <ShoppingBag size={24} />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </span>
      )}
    </button>
  );
};

