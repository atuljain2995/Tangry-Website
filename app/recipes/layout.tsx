import { Metadata } from 'next';
import { RecipesChrome } from './RecipesChrome';

export const metadata: Metadata = {
  title: 'Indian Recipes with Tangry Spices — Quick, Authentic Home Cooking',
  description:
    'Easy Indian recipes using Tangry masalas and spices — pav bhaji, dabeli, chaas, podi idli, peri peri fries, poha, and more. Step-by-step, tested at home.',
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return <RecipesChrome>{children}</RecipesChrome>;
}
