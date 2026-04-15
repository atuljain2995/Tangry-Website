import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale | Bulk Spices & Masalas — Tangry Spices',
  description:
    'Buy Tangry spices and masalas in bulk. Wholesale pricing for restaurants, hotels, caterers, and retailers. FSSAI licensed, ISO 22000 certified.',
  alternates: { canonical: '/wholesale' },
  openGraph: {
    title: 'Wholesale Spices & Masalas — Tangry Spices',
    description:
      'Bulk pricing for restaurants, hotels, and retailers. FSSAI licensed, ISO 22000 certified spices from Jaipur.',
    url: 'https://www.tangryspices.com/wholesale',
    type: 'website',
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
