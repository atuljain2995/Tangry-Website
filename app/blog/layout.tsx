import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Spice Tips, Recipes & Food Stories',
  description:
    'Read about the health benefits of turmeric, how to use Indian spices, authentic Rajasthani recipes, and food stories from Tangry Spices, Jaipur.',
  robots: { index: false, follow: false },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
