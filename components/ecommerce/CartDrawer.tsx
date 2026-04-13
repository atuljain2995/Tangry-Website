'use client';

import { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { CartItemComponent } from './CartItem';
import { formatCurrency } from '@/lib/utils/database';
import { buildWhatsAppOrderUrl } from '@/lib/utils/whatsapp-order';
import Link from 'next/link';

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, cartItemCount } = useCart();
  const whatsappOrderUrl = buildWhatsAppOrderUrl(cart);

  useEffect(() => {
    if (!isCartOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Light scrim: page stays visible; click-through closes cart */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-[2px] transition-opacity motion-reduce:backdrop-blur-none dark:bg-black/30"
          aria-hidden
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 dark:shadow-black/50 md:w-96 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-700">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-[#D32F2F]" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
              Shopping Cart ({cartItemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-gray-500 transition hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="mb-4 text-gray-300 dark:text-neutral-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-600 dark:text-neutral-300">Your cart is empty</h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-neutral-400">Add some delicious spices to get started!</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-block bg-[#D32F2F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#B71C1C] transition text-center"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <CartItemComponent 
                  key={`${item.productId}-${item.variantId}`} 
                  item={item} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Cart Summary */}
        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/80">
            {/* Subtotal */}
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">{formatCurrency(cart.subtotal)}</span>
            </div>

            {/* Discount */}
            {cart.discount > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(cart.discount)}</span>
              </div>
            )}

            {/* Shipping */}
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Shipping</span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">
                {cart.shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  formatCurrency(cart.shipping)
                )}
              </span>
            </div>

            {/* Free shipping message */}
            {cart.subtotal < 499 && cart.subtotal > 0 && (
              <div className="mb-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/40 dark:text-yellow-200">
                Add {formatCurrency(499 - cart.subtotal)} more for FREE shipping!
              </div>
            )}

            {/* Tax */}
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">Tax (GST 5%)</span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">{formatCurrency(cart.tax)}</span>
            </div>

            {/* Total */}
            <div className="mb-4 flex justify-between border-t border-gray-300 pt-3 dark:border-neutral-600">
              <span className="text-lg font-bold text-gray-900 dark:text-neutral-100">Total</span>
              <span className="text-lg font-bold text-[#D32F2F]">{formatCurrency(cart.total)}</span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <button
                onClick={closeCart}
                className="w-full bg-[#D32F2F] text-white py-3 rounded-full font-bold hover:bg-[#B71C1C] transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to checkout</span>
                <ArrowRight size={20} />
              </button>
            </Link>

            {whatsappOrderUrl && (
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeCart}
                className="mt-3 w-full border-2 border-[#25D366] text-[#128C7E] py-3 rounded-full font-bold hover:bg-[#25D366]/10 transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} className="shrink-0" />
                <span>Order on WhatsApp</span>
              </a>
            )}

            {/* Continue Shopping */}
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 w-full py-2 text-center text-sm text-gray-600 transition hover:text-[#D32F2F] dark:text-neutral-400 dark:hover:text-orange-400"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

