import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Spice Tips, Recipes & Food Stories',
  description:
    'Read about the health benefits of turmeric, how to use Indian spices, authentic Rajasthani recipes, and food stories from Tangry Spices, Jaipur.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
