import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipes | Cook Authentic Indian Dishes with Tangry Spices',
  description:
    'Explore easy Indian recipes — paneer butter masala, dal tadka, biryani, and more. Step-by-step instructions using Tangry masalas and spice blends.',
  robots: { index: false, follow: false },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
