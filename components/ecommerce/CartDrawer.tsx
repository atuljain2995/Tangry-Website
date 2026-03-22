'use client';

import { X, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { CartItemComponent } from './CartItem';
import { formatCurrency } from '@/lib/utils/database';
import { buildWhatsAppOrderUrl } from '@/lib/utils/whatsapp-order';
import Link from 'next/link';

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, cartItemCount } = useCart();
  const whatsappOrderUrl = buildWhatsAppOrderUrl(cart);

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-[#D32F2F]" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Shopping Cart ({cartItemCount})
            </h2>
          </div>
          <button 
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-6">Add some delicious spices to get started!</p>
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
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
            </div>

            {/* Discount */}
            {cart.discount > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(cart.discount)}</span>
              </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {cart.shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  formatCurrency(cart.shipping)
                )}
              </span>
            </div>

            {/* Free shipping message */}
            {cart.subtotal < 499 && cart.subtotal > 0 && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                Add {formatCurrency(499 - cart.subtotal)} more for FREE shipping!
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-600">Tax (GST 5%)</span>
              <span className="font-medium">{formatCurrency(cart.tax)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between mb-4 pt-3 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total</span>
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
              onClick={closeCart}
              className="w-full mt-2 text-center text-sm text-gray-600 hover:text-[#D32F2F] transition py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

