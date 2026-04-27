import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet Maya Jain | Founder of Tangry Spices, Jaipur',
  description:
    'Maya Jain founded Tangry Spices to bring authentic, filler-free Rajasthani masalas to every Indian kitchen. Learn about her journey from Jhotwara, Jaipur.',
  alternates: { canonical: '/about/founder' },
  openGraph: {
    title: 'Maya Jain — Founder of Tangry Spices',
    description:
      'The story behind Tangry: why Maya Jain started a spice brand in Jaipur to bring home-ground taste to packaged masalas.',
    url: 'https://www.tangryspices.com/about/founder',
    type: 'profile',
  },
};

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
