import type { Metadata } from 'next';
import { StructuredData } from '@/components/seo/StructuredData';
import { getRecipeListSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { recipes } from '@/lib/data/recipes';

const SITE_URL = 'https://www.tangryspices.com';

export const metadata: Metadata = {
  alternates: { canonical: '/recipes' },
};

export default function RecipesPage() {
  const featured = recipes.filter((r) => r.featured);
  const rest = recipes.filter((r) => !r.featured);

  return (
    <>
      <StructuredData
        data={[
          getBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Recipes', url: `${SITE_URL}/recipes` },
          ]),
          getRecipeListSchema(recipes),
        ]}
      />
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Recipes with Tangry Spices</h1>
            <p className="text-neutral-600">
              Easy, authentic Indian recipes using our masalas and spice blends — from Mumbai street
              food to Rajasthani breakfast classics.
            </p>
          </div>

          {featured.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Featured Recipes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((recipe) => (
                  <RecipeCard key={recipe.slug} recipe={recipe} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">More Recipes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((recipe) => (
                  <RecipeCard key={recipe.slug} recipe={recipe} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
