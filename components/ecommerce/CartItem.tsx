'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/lib/types/database';
import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils/database';
import Image from 'next/image';

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
    removeFromCart(item.productId, item.variantId);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.productName}
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
        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
          {item.productName}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{item.variantName}</p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
            <button
              onClick={handleDecrease}
              className="p-1 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-1 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(itemTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">
                {formatCurrency(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-600 transition self-start"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

