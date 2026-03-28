import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order',
  description:
    'Track your Tangry Spices order: sign in to view order history or find help with your order confirmation email.',
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
