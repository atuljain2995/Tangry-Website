'use client';

import { useState } from 'react';
import { Star, Plus, Minus, Heart } from 'lucide-react';
import { ProductExtended } from '@/lib/types/database';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils/database';
import Link from 'next/link';
import { ProductImage } from './ProductImage';
import { productImageAlt } from '@/lib/utils/product-image-alt';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProductCardProps {
  product: ProductExtended;
}

const PLACEHOLDER_IMAGE = '/images/logo-512.png';

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { addToCart, cart, updateQuantity } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercentage = calculateDiscountPercentage(selectedVariant.price, selectedVariant.compareAtPrice);
  const imageSrc = product.images[0] || PLACEHOLDER_IMAGE;

  // Find quantity of this variant already in cart
  const cartItem = cart.items.find(
    item => item.productId === product.id && item.variantId === selectedVariant.id
  );
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
      productName: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      image: product.images[0] || '',
    });
  };

  const handleIncrement = () => {
    updateQuantity(product.id, selectedVariant.id, quantityInCart + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, selectedVariant.id, quantityInCart - 1);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 p-3">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-60 bg-gray-50 rounded-xl overflow-hidden">
          {imageSrc ? (
            <ProductImage
              src={imageSrc}
              alt={productImageAlt(product.name, selectedVariant.name)}
              fill
              className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-2xl uppercase">
              {product.name.split(' ')[0]}
            </div>
          )}

          {/* Left Badge - NEW or BEST SELLER */}
          {(product.isNew || product.isBestSeller) && (
            <div className="absolute top-3 left-3">
              {product.isBestSeller ? (
                <span className="bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                  Best Seller
                </span>
              ) : product.isNew ? (
                <span className="bg-white text-gray-900 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide shadow-sm">
                  New
                </span>
              ) : null}
            </div>
          )}

          {/* Right Badge - Discount */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-100 text-green-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                {discountPercentage}% OFF
              </span>
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!user) { window.location.href = '/login'; return; }
              toggleWishlist(product.id);
            }}
            className={`absolute bottom-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition hover:scale-110 z-10 ${
              isWishlisted(product.id) ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-[#D32F2F]'
            }`}
            aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-4 pt-4 pb-5 flex-1 flex flex-col">
        {/* Category */}
        <p className="text-orange-600 text-[11px] font-bold uppercase tracking-widest mb-1">{product.category}</p>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-1 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-orange-600 dark:text-neutral-100 dark:group-hover:text-orange-400">
            {product.name}
          </h3>
        </Link>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.variants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantIndex(index)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
                  selectedVariantIndex === index
                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-neutral-600 dark:text-neutral-400'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={13} 
                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="ml-1.5 text-xs text-gray-500 dark:text-neutral-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-neutral-800 mb-4" />

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900 dark:text-neutral-100">
              {formatCurrency(selectedVariant.price)}
            </span>
            {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
              <span className="text-sm text-gray-400 line-through dark:text-neutral-500">
                {formatCurrency(selectedVariant.compareAtPrice)}
              </span>
            )}
          </div>
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-1 py-0.5">
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-bold text-orange-700 min-w-[20px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
