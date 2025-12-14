'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { CartItem } from '@/lib/types/database';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price: number;
  image: string;
  quantity?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const AddToCartButton = ({
  productId,
  productName,
  variantId,
  variantName,
  price,
  image,
  quantity = 1,
  className = '',
  size = 'md',
  disabled = false
}: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    const item: CartItem = {
      productId,
      productName,
      variantId,
      variantName,
      price,
      quantity,
      image
    };

    addToCart(item);
    setIsAdded(true);

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = `
    font-semibold rounded-full transition-all duration-300 
    flex items-center justify-center space-x-2
    ${sizeClasses[size]}
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : isAdded 
        ? 'bg-green-600 text-white' 
        : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C] hover:shadow-lg transform hover:-translate-y-0.5'
    }
    ${className}
  `;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdded}
      className={baseClasses}
      aria-label={`Add ${productName} to cart`}
    >
      {isAdded ? (
        <>
          <Check size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

