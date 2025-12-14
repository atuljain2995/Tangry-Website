'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types/database';
import { calculateCartTotals, calculateShipping } from '../utils/database';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tangry_cart';

function getInitialCart(): Cart {
  if (typeof window === 'undefined') {
    return createEmptyCart();
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsedCart = JSON.parse(stored);
      return {
        ...parsedCart,
        createdAt: new Date(parsedCart.createdAt),
        updatedAt: new Date(parsedCart.updatedAt)
      };
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }

  return createEmptyCart();
}

function createEmptyCart(): Cart {
  return {
    id: generateCartId(),
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const updateCart = (updater: (cart: Cart) => Cart) => {
    setCart(currentCart => {
      const newCart = updater(currentCart);
      const shipping = calculateShipping(newCart.subtotal);
      return calculateCartTotals(newCart, shipping);
    });
  };

  const addToCart = (item: CartItem) => {
    updateCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(
        i => i.productId === item.productId && i.variantId === item.variantId
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...currentCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
      } else {
        // Add new item
        newItems = [...currentCart.items, item];
      }

      return {
        ...currentCart,
        items: newItems,
        updatedAt: new Date()
      };
    });

    // Open cart drawer when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    updateCart(currentCart => ({
      ...currentCart,
      items: currentCart.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      ),
      updatedAt: new Date()
    }));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    updateCart(currentCart => ({
      ...currentCart,
      items: currentCart.items.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      ),
      updatedAt: new Date()
    }));
  };

  const clearCart = () => {
    setCart(createEmptyCart());
  };

  const applyCoupon = (code: string) => {
    updateCart(currentCart => ({
      ...currentCart,
      couponCode: code.toUpperCase(),
      updatedAt: new Date()
    }));
  };

  const removeCoupon = () => {
    updateCart(currentCart => ({
      ...currentCart,
      couponCode: undefined,
      updatedAt: new Date()
    }));
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartItemCount,
        isCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

