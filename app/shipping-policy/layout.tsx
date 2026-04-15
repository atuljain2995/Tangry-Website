import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Shipping and delivery information for Tangry Spices orders: processing time, delivery across India, and how to get help.',
  alternates: { canonical: '/shipping-policy' },
  openGraph: {
    title: 'Shipping Policy — Tangry Spices',
    description: 'Delivery timelines, shipping charges, and order tracking for Tangry Spices.',
    url: 'https://www.tangryspices.com/shipping-policy',
    type: 'website',
  },
};

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
