import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { recipes } from '@/lib/data/recipes';

export const Recipes = () => {
  const featured = recipes.filter((r) => r.featured).slice(0, 3);

  return (
    <section id="recipes" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-[#D32F2F] font-bold uppercase tracking-wider text-sm">
              Culinary Corner
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
              Cook with Tangry
            </h2>
          </div>
          <Link
            href="/recipes"
            className="hidden md:flex items-center text-gray-600 hover:text-[#D32F2F] font-medium mt-4 md:mt-0"
          >
            View all recipes <ArrowRight size={16} className="ml-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/recipes"
            className="inline-flex items-center text-gray-600 hover:text-[#D32F2F] font-medium"
          >
            View all recipes <ArrowRight size={16} className="ml-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
