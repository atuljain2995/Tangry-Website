import type { Metadata } from 'next';
import { StructuredData } from '@/components/seo/StructuredData';
import { getRecipeListSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { recipes } from '@/lib/data/recipes';

const SITE_URL = 'https://www.tangryspices.com';

const RECIPES_TITLE = 'Indian Recipes with Tangry Spices — Quick, Authentic Home Cooking';
const RECIPES_DESCRIPTION =
  'Easy Indian recipes using Tangry masalas and spices — pav bhaji, dabeli, chaas, podi idli, peri peri fries, poha, and more. Step-by-step, tested at home.';
const RECIPES_OG_IMAGE = `${SITE_URL}/images/recipes/pav-bhaji.jpg`;

export const metadata: Metadata = {
  alternates: { canonical: '/recipes' },
  openGraph: {
    title: RECIPES_TITLE,
    description: RECIPES_DESCRIPTION,
    url: `${SITE_URL}/recipes`,
    type: 'website',
    images: [
      {
        url: RECIPES_OG_IMAGE,
        width: 1200,
        height: 669,
        alt: 'Mumbai pav bhaji made with Tangry Pav Bhaji Masala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: RECIPES_TITLE,
    description: RECIPES_DESCRIPTION,
    images: [RECIPES_OG_IMAGE],
  },
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
