import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipes | Cook Authentic Indian Dishes with Tangry Spices',
  description:
    'Explore easy Indian recipes — paneer butter masala, dal tadka, biryani, and more. Step-by-step instructions using Tangry masalas and spice blends.',
  alternates: { canonical: '/recipes' },
  openGraph: {
    title: 'Recipes | Cook with Tangry Spices',
    description:
      'Authentic Indian recipes using Tangry masalas. Paneer butter masala, biryani, dal tadka and more.',
    url: 'https://www.tangryspices.com/recipes',
    type: 'website',
  },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
