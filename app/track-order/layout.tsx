import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order',
  description:
    'Track your Tangry Spices order: sign in to view order history or find help with your order confirmation email.',
  alternates: { canonical: '/track-order' },
  openGraph: {
    title: 'Track Your Order — Tangry Spices',
    description: 'Check the status of your Tangry Spices order.',
    url: 'https://www.tangryspices.com/track-order',
    type: 'website',
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
