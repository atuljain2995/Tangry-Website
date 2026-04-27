'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { COMPANY_INFO } from '@/lib/data/constants';

export default function ShippingPolicyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="page-shell">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <article className="container mx-auto px-6 py-20 mt-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping policy</h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated for customers shopping on this site
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Where we ship</h2>
            <p>
              We ship orders across India to the address you provide at checkout. Delivery options
              and estimated timelines may vary by pincode; where available, you can check delivery
              hints on the product page before you buy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing time</h2>
            <p>
              Orders are typically packed within 1–2 business days after payment confirmation.
              During sales or holidays, processing may take a little longer — we will communicate
              delays by email when they affect your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delivery</h2>
            <p>
              We partner with trusted courier services. Once your order ships, you should receive
              tracking or delivery updates by email where the carrier provides them. Actual delivery
              dates depend on the courier and your location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Fees</h2>
            <p>
              Shipping charges, if any, are shown at checkout before you pay. Any applicable taxes
              are calculated based on your shipping address and displayed with your order total.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Damaged or missing items</h2>
            <p>
              If something arrives damaged or items are missing, contact us within 48 hours of
              delivery with your order number and photos if applicable. We will work with you to
              resolve it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Questions</h2>
            <p>
              For anything not covered here, reach us at{' '}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="text-orange-600 font-medium hover:underline"
              >
                {COMPANY_INFO.email}
              </a>{' '}
              or use the{' '}
              <Link href="/contact" className="text-orange-600 font-medium hover:underline">
                contact form
              </Link>
              .
            </p>
          </section>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/track-order" className="text-orange-600 hover:underline font-medium">
            Track an order
          </Link>
          {' · '}
          <Link href="/contact" className="text-orange-600 hover:underline font-medium">
            Contact
          </Link>
        </p>
      </article>

      <Footer />
    </main>
  );
}
