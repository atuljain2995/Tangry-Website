'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { COMPANY_INFO } from '@/lib/data/constants';
import { Package, Mail } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function TrackOrderPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-6 py-20 mt-20 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Track your order</h1>
        <p className="text-gray-600 text-center mb-12">
          After checkout we email you updates. Signed-in customers can also view orders anytime.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-100 p-3 text-orange-700">
                <Package className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Account orders</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Log in with the same email you used at checkout to see status, items, and totals.
                </p>
                <Link
                  href="/account/orders"
                  className="inline-flex font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Go to my orders →
                </Link>
                {!user && (
                  <p className="text-sm text-gray-500 mt-3">
                    No account yet?{' '}
                    <Link href="/signup?redirect=/account/orders" className="text-orange-600 font-medium hover:underline">
                      Create one
                    </Link>{' '}
                    or{' '}
                    <Link href="/login?redirect=/account/orders" className="text-orange-600 font-medium hover:underline">
                      Sign in
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                <Mail className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Email &amp; support</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Your order confirmation includes details. For tracking help, reply to that email or write to us with
                  your order number.
                </p>
                <a
                  href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent('Order tracking help')}`}
                  className="inline-flex font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500">
          <Link href="/shipping-policy" className="text-orange-600 hover:underline font-medium">
            Shipping policy
          </Link>
          {' · '}
          <Link href="/contact" className="text-orange-600 hover:underline font-medium">
            Contact
          </Link>
        </p>
      </div>

      <Footer />
    </main>
  );
}
