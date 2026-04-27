'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/lib/types/database';
import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils/database';
import { analytics } from '@/lib/analytics';
import { ProductImage } from './ProductImage';
import { productImageAlt } from '@/lib/utils/product-image-alt';

interface CartItemProps {
  item: CartItem;
}

export const CartItemComponent = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.productId, item.variantId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.variantId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    analytics.trackRemoveFromCart(item.productId, item.productName, item.quantity, item.price);
    removeFromCart(item.productId, item.variantId);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex space-x-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/80">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-neutral-700">
        {item.image ? (
          <ProductImage
            src={item.image}
            alt={productImageAlt(item.productName, item.variantName)}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="mb-1 truncate text-sm font-semibold text-gray-900 dark:text-neutral-100">
          {item.productName}
        </h3>
        <p className="mb-2 text-xs text-gray-500 dark:text-neutral-400">{item.variantName}</p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 rounded-md border border-gray-300 dark:border-neutral-600">
            <button
              type="button"
              onClick={handleDecrease}
              className="p-1 transition hover:bg-gray-100 dark:hover:bg-neutral-700"
              aria-label="Decrease quantity"
            >
              <Minus size={14} className="text-gray-600 dark:text-neutral-300" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-neutral-100">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="p-1 transition hover:bg-gray-100 dark:hover:bg-neutral-700"
              aria-label="Increase quantity"
            >
              <Plus size={14} className="text-gray-600 dark:text-neutral-300" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-neutral-100">
              {formatCurrency(itemTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {formatCurrency(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={handleRemove}
        className="self-start text-gray-400 transition hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-400"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
