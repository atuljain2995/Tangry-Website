'use client';

import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { ProductExtended } from '@/lib/types/database';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import Link from 'next/link';

interface WishlistClientProps {
  products: ProductExtended[];
}

export function WishlistClient({ products }: WishlistClientProps) {
  const { productIds } = useWishlist();

  // Show products that are still in the wishlist (handles optimistic removals)
  const wishlistProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">My Wishlist</h1>

      {wishlistProducts.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mb-6">
            Browse our products and tap the heart icon to save items you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#B71C1C] transition"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
