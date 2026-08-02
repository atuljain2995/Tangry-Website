'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils/database';
import { ProductImage } from './ProductImage';

type Topup = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string;
  variantName: string;
  price: number;
};

/** Specific low-price add-ons shown in the cart drawer to convert the free-delivery nudge,
 * instead of a generic "browse products" link. */
export function CartTopupSuggestions({ excludeVariantIds }: { excludeVariantIds: string[] }) {
  const { addToCart } = useCart();
  const [topups, setTopups] = useState<Topup[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products/cheap-topups?limit=8')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Topup[]) => {
        if (!cancelled) setTopups(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = topups
    .filter((t) => !excludeVariantIds.includes(t.variantId))
    .slice(0, 2);

  if (!suggestions.length) return null;

  return (
    <div className="mb-3 space-y-2">
      {suggestions.map((item) => (
        <div
          key={item.variantId}
          className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900"
        >
          {item.image && (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={item.image} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-900 dark:text-neutral-100">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              {item.variantName} · {formatCurrency(item.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              addToCart({
                productId: item.productId,
                variantId: item.variantId,
                quantity: 1,
                productName: item.name,
                variantName: item.variantName,
                price: item.price,
                image: item.image,
              });
              setAddedId(item.variantId);
            }}
            disabled={addedId === item.variantId}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-700 disabled:bg-green-600"
          >
            {addedId === item.variantId ? 'Added' : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
