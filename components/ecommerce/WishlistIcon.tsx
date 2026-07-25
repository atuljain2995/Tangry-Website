'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/contexts/WishlistContext';

export const WishlistIcon = () => {
  const { productIds } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount gate
    setMounted(true);
  }, []);

  const count = productIds.length;

  return (
    <Link
      href="/account/wishlist"
      className="relative p-2 text-gray-700 transition hover:text-[#D32F2F] dark:text-neutral-200 dark:hover:text-orange-400"
      aria-label="View wishlist"
    >
      <Heart size={24} />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};
