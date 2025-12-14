'use client';

import { useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { ProductExtended } from '@/lib/types/database';
import { formatCurrency, calculateDiscountPercentage, getStockStatus } from '@/lib/utils/database';
import { AddToCartButton } from './AddToCartButton';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: ProductExtended;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercentage = calculateDiscountPercentage(selectedVariant.price, selectedVariant.compareAtPrice);
  const stockStatus = getStockStatus(selectedVariant.stock);

  return (
    <div className="group bg-white rounded-3xl p-4 border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-64 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl overflow-hidden mb-6">
          {product.images[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/80 font-black text-2xl uppercase">
              {product.name.split(' ')[0]}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isNew && (
              <span className="bg-white/90 backdrop-blur text-gray-900 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide">NEW</span>
            )}
            {product.isBestSeller && (
              <span className="bg-white/90 backdrop-blur text-gray-900 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide">BEST SELLER</span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-white/90 backdrop-blur text-gray-900 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-2 pb-2 flex-1 flex flex-col">
        {/* Category */}
        <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">{product.category}</p>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-2xl font-black text-gray-900 leading-none mb-3 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(product.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2 font-medium">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2 font-bold">Size:</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition ${
                    selectedVariantIndex === index
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-orange-600'
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-gray-900">
                {formatCurrency(selectedVariant.price)}
              </span>
            </div>
            {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
              <span className="text-xs text-gray-500 line-through font-medium">
                {formatCurrency(selectedVariant.compareAtPrice)}
              </span>
            )}
          </div>
          <Link 
            href={`/products/${product.slug}`}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition group-hover:scale-110 shadow-lg"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stock Status */}
        <div className="mt-3">
          <span className={`text-xs font-bold uppercase tracking-wide ${
            stockStatus.color === 'green' ? 'text-green-600' :
            stockStatus.color === 'orange' ? 'text-orange-600' :
            'text-red-600'
          }`}>
            {stockStatus.label}
          </span>
        </div>
      </div>
    </div>
  );
};
