import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | Tangry Spices',
  description:
    'Tangry Spices 7-day return policy — conditions, process, refund timeline, and who bears shipping costs for returns.',
  alternates: { canonical: '/returns' },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
