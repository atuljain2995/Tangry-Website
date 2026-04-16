'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getWishlist, toggleWishlistItem } from '@/lib/actions/wishlist';

type WishlistState = {
  productIds: string[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistState | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (!user) {
      setProductIds([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getWishlist().then((res) => {
      if (!cancelled && res.success) {
        setProductIds(res.productIds);
      }
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return;
      // Optimistic update
      setProductIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
      const res = await toggleWishlistItem(productId);
      if (res.success) {
        setProductIds(res.productIds);
      }
    },
    [user],
  );

  return (
    <WishlistContext.Provider value={{ productIds, loading, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
