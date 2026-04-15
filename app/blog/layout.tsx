import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Spice Tips, Recipes & Food Stories',
  description:
    'Read about the health benefits of turmeric, how to use Indian spices, authentic Rajasthani recipes, and food stories from Tangry Spices, Jaipur.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Spice Tips, Recipes & Food Stories — Tangry Spices',
    description:
      'Tips on Indian spices, health benefits of turmeric, authentic recipes, and more from Tangry Spices.',
    url: 'https://www.tangryspices.com/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
