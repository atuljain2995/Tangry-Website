'use client';

import React from 'react';
import { AdminLink } from '@/components/admin/AdminLink';
import { Package, Pencil } from 'lucide-react';
import type { ProductExtended } from '@/lib/types/database';

function ProductRowImage({ src, alt }: { src: string; alt: string }) {
  const [url, setUrl] = React.useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className="w-12 h-12 object-cover rounded"
      onError={() => setUrl('/images/logo-512.png')}
    />
  );
}

export function AdminProductList({ products }: { products: ProductExtended[] }) {
  return (
    <ul className="space-y-3">
      {products.length === 0 ? (
        <li className="text-gray-500">No products found. Run migrations and seed.</li>
      ) : (
        products.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {p.images?.[0] ? (
                <ProductRowImage src={p.images[0]} alt={p.name} />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-gray-500 text-sm block">{p.category}</span>
              </div>
            </div>
            <AdminLink
              href={`/admin/products/${p.id}`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700 touch-manipulation"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </AdminLink>
          </li>
        ))
      )}
    </ul>
  );
}
