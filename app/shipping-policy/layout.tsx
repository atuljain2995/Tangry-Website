import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Shipping and delivery information for Tangry Spices orders: processing time, delivery across India, and how to get help.',
};

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
