'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Cart, CartItem } from '../types/database';
import { calculateCartTotals } from '../utils/database';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tangry_cart';

/** SSR-safe: same value on server and client to avoid hydration mismatch (fixes hard-refresh break). */
function getSSRSafeInitialCart(): Cart {
  return createEmptyCart();
}

function loadCartFromStorage(): Cart | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsedCart = JSON.parse(stored);
      return {
        ...parsedCart,
        createdAt: new Date(parsedCart.createdAt),
        updatedAt: new Date(parsedCart.updatedAt),
      };
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return null;
}

function normalizeStoredCart(cart: Cart): Cart {
  const hasValidDiscount = typeof cart.discount === 'number' && cart.discount > 0;

  // Prevent stale UI where coupon code exists from older sessions but discount is zero.
  if (cart.couponCode && !hasValidDiscount) {
    return {
      ...cart,
      couponCode: undefined,
      discount: 0,
    };
  }

  if (!cart.couponCode && cart.discount > 0) {
    return {
      ...cart,
      discount: 0,
    };
  }

  return cart;
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
    updatedAt: new Date(),
  };
}

function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(getSSRSafeInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hasHydrated = useRef(false);

  // After mount, load cart from localStorage (avoids hydration mismatch on hard refresh)
  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored) {
      const normalized = normalizeStoredCart(stored);
      queueMicrotask(() => {
        setCart(() => calculateCartTotals(normalized, 0));
      });
    }
    hasHydrated.current = true;
  }, []);

  // Save cart to localStorage when it changes (only after we've run hydration so we don't overwrite with empty)
  useEffect(() => {
    if (!hasHydrated.current || typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const updateCart = (updater: (cart: Cart) => Cart) => {
    setCart((currentCart) => {
      const newCart = updater(currentCart);
      return calculateCartTotals(newCart, 0);
    });
  };

  const addToCart = (item: CartItem) => {
    updateCart((currentCart) => {
      const existingItemIndex = currentCart.items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...currentCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity,
        };
      } else {
        // Add new item
        newItems = [...currentCart.items, item];
      }

      return {
        ...currentCart,
        items: newItems,
        couponCode: undefined,
        discount: 0,
        updatedAt: new Date(),
      };
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId),
      ),
      couponCode: undefined,
      discount: 0,
      updatedAt: new Date(),
    }));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    updateCart((currentCart) => ({
      ...currentCart,
      items: currentCart.items.map((item) =>
        item.productId === productId && item.variantId === variantId ? { ...item, quantity } : item,
      ),
      couponCode: undefined,
      discount: 0,
      updatedAt: new Date(),
    }));
  };

  const clearCart = () => {
    setCart(createEmptyCart());
  };

  const applyCoupon = (code: string, discount: number) => {
    updateCart((currentCart) => ({
      ...currentCart,
      couponCode: code.toUpperCase(),
      discount,
      updatedAt: new Date(),
    }));
  };

  const removeCoupon = () => {
    updateCart((currentCart) => ({
      ...currentCart,
      couponCode: undefined,
      discount: 0,
      updatedAt: new Date(),
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
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    // During prerendering/SSR, return a default state
    if (typeof window === 'undefined') {
      return {
        cart: createEmptyCart(),
        addToCart: () => {},
        removeFromCart: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        applyCoupon: () => {},
        removeCoupon: () => {},
        cartItemCount: 0,
        isCartOpen: false,
        openCart: () => {},
        closeCart: () => {},
      };
    }
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
