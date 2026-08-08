import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChefHat } from 'lucide-react';
import type { Recipe } from '@/lib/data/recipes';

type Variant = 'full' | 'compact';

export function RecipeCard({ recipe, variant = 'full' }: { recipe: Recipe; variant?: Variant }) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const compact = variant === 'compact';

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group block border border-neutral-200 bg-white rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      <div className={`relative ${compact ? 'h-28' : 'h-44'}`}>
        <Image
          src={recipe.image}
          alt={recipe.imageAlt}
          fill
          sizes={
            compact
              ? '(max-width: 640px) 100vw, 33vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          }
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!compact && (
          <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold text-neutral-700 px-2.5 py-1 rounded-full">
            {recipe.category}
          </span>
        )}
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <h3
          className={`font-semibold text-neutral-900 group-hover:text-red-700 leading-snug line-clamp-2 ${
            compact ? 'text-sm' : 'mb-1.5'
          }`}
        >
          {recipe.title}
        </h3>

        {compact ? (
          <p className="text-xs text-neutral-500 mt-1">
            {totalTime} min · {recipe.difficulty}
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{recipe.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {totalTime} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Serves {recipe.servings}
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
                {recipe.difficulty}
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
