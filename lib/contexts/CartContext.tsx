'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Cart, CartItem } from '../types/database';
import { calculateCartTotals } from '../utils/database';

interface CartContextType {
  cart: Cart;
  /** False until localStorage has been read on the client. */
  isCartHydrated: boolean;
  addToCart: (item: CartItem) => void;
  /** Adds item and writes to localStorage immediately (for Buy Now navigation). */
  addToCartSync: (item: CartItem) => void;
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

function persistCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
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

function mergeCartItem(currentCart: Cart, item: CartItem): Cart {
  const existingItemIndex = currentCart.items.findIndex(
    (i) => i.productId === item.productId && i.variantId === item.variantId,
  );

  let newItems: CartItem[];
  if (existingItemIndex >= 0) {
    newItems = [...currentCart.items];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newItems[existingItemIndex].quantity + item.quantity,
    };
  } else {
    newItems = [...currentCart.items, item];
  }

  return {
    ...currentCart,
    items: newItems,
    couponCode: undefined,
    discount: 0,
    updatedAt: new Date(),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(getSSRSafeInitialCart);
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isCartHydratedRef = useRef(false);

  // Load persisted cart once on the client; gate checkout until this completes.
  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored) {
      queueMicrotask(() => {
        setCart(calculateCartTotals(normalizeStoredCart(stored), 0));
      });
    }
    queueMicrotask(() => {
      isCartHydratedRef.current = true;
      setIsCartHydrated(true);
    });
  }, []);

  const commitCart = (nextCart: Cart, persistImmediately = false) => {
    const totals = calculateCartTotals(nextCart, 0);
    if (persistImmediately || isCartHydratedRef.current) {
      persistCart(totals);
    }
    setCart(totals);
  };

  const updateCart = (updater: (cart: Cart) => Cart) => {
    setCart((currentCart) => {
      const next = calculateCartTotals(updater(currentCart), 0);
      if (isCartHydratedRef.current) {
        persistCart(next);
      }
      return next;
    });
  };

  const addToCart = (item: CartItem) => {
    updateCart((currentCart) => mergeCartItem(currentCart, item));
  };

  const addToCartSync = (item: CartItem) => {
    setCart((currentCart) => {
      const next = calculateCartTotals(mergeCartItem(currentCart, item), 0);
      persistCart(next);
      isCartHydratedRef.current = true;
      return next;
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
    const empty = createEmptyCart();
    commitCart(empty, true);
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
        isCartHydrated,
        addToCart,
        addToCartSync,
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
        isCartHydrated: false,
        addToCart: () => {},
        addToCartSync: () => {},
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
