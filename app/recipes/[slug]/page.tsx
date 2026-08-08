import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowDown, Utensils, Refrigerator } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { getRecipeSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeIngredients, PrintRecipeButton } from '@/components/recipes/RecipeIngredients';
import { RecipeToc, RecipeShare, type TocItem } from '@/components/recipes/RecipeToc';
import { RecipeRating } from '@/components/recipes/RecipeRating';
import { getRecipeRating } from '@/lib/db/recipe-ratings';
import { recipes, getRecipe } from '@/lib/data/recipes';

const SITE_URL = 'https://www.tangryspices.com';

type PageProps = { params: Promise<{ slug: string }> };

// Ratings change independently of the content, so refresh more often than daily.
export const revalidate = 3600;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: 'Recipe Not Found' };

  return {
    title: recipe.title,
    description: recipe.seoDescription,
    keywords: recipe.keywords,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: recipe.title,
      description: recipe.seoDescription,
      url: `${SITE_URL}/recipes/${recipe.slug}`,
      type: 'article',
      publishedTime: recipe.date,
      modifiedTime: recipe.updated,
      images: [
        { url: `${SITE_URL}${recipe.image}`, width: 1200, height: 669, alt: recipe.imageAlt },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.seoDescription,
      images: [`${SITE_URL}${recipe.image}`],
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const totalTime = recipe.prepTime + recipe.cookTime;
  const otherRecipes = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);
  const updated = new Date(recipe.updated);
  const pageUrl = `${SITE_URL}/recipes/${recipe.slug}`;
  const rating = await getRecipeRating(recipe.slug);

  const toc: TocItem[] = [
    { id: 'about', label: `About this recipe` },
    { id: 'recipe', label: 'Ingredients & instructions' },
    ...(recipe.tips.length ? [{ id: 'tips', label: 'Expert tips' }] : []),
    ...(recipe.servingSuggestions ? [{ id: 'serving', label: 'Serving suggestions' }] : []),
    ...(recipe.storage ? [{ id: 'storage', label: 'Storage & reheating' }] : []),
    { id: 'ratings', label: 'Ratings' },
    { id: 'more-recipes', label: 'More recipes' },
  ];

  return (
    <>
      <StructuredData
        data={[
          getBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Recipes', url: `${SITE_URL}/recipes` },
            { name: recipe.title, url: pageUrl },
          ]),
          getRecipeSchema(recipe, rating),
        ]}
      />
      <div className="min-h-screen bg-neutral-50 pt-20 print:pt-0 print:bg-white">
        <article className="max-w-3xl mx-auto px-4 py-8 print:py-0 print:max-w-none">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-700 mb-6 transition-colors print:hidden"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All Recipes
          </Link>

          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 print:hidden">
            <Image
              src={recipe.image}
              alt={recipe.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">{recipe.title}</h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500 mb-4">
            <span>
              By <span className="font-medium text-neutral-700">{recipe.author}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Updated{' '}
              <time dateTime={recipe.updated}>
                {updated.toLocaleDateString('en-IN', DATE_FORMAT)}
              </time>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <a
              href="#recipe"
              className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-800 transition-colors print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
              Jump to Recipe
            </a>
            <PrintRecipeButton />
          </div>

          <div className="mb-6">
            <RecipeShare url={pageUrl} title={recipe.title} />
          </div>

          <RecipeToc items={toc} />

          <section id="about" className="scroll-mt-24 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">About this recipe</h2>
            <div className="text-neutral-600 leading-7 space-y-4">
              {recipe.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Recipe card */}
          <section
            id="recipe"
            className="scroll-mt-24 border-2 border-red-200 rounded-2xl bg-white p-5 sm:p-6 mb-8 print:border-black"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{recipe.title}</h2>
                <p className="text-sm text-neutral-500 mt-1">{recipe.excerpt}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm mb-6">
              <div>
                <dt className="text-xs text-neutral-500">Prep time</dt>
                <dd className="font-medium text-neutral-800">{recipe.prepTime} min</dd>
              </div>
              {recipe.cookTime > 0 && (
                <div>
                  <dt className="text-xs text-neutral-500">Cook time</dt>
                  <dd className="font-medium text-neutral-800">{recipe.cookTime} min</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-neutral-500">Total time</dt>
                <dd className="font-medium text-neutral-800">{totalTime} min</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Servings</dt>
                <dd className="font-medium text-neutral-800">{recipe.servings}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Course</dt>
                <dd className="font-medium text-neutral-800">{recipe.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Cuisine</dt>
                <dd className="font-medium text-neutral-800">{recipe.cuisine}</dd>
              </div>
            </dl>

            <RecipeIngredients
              ingredients={recipe.ingredients}
              groups={recipe.ingredientGroups}
              baseServings={recipe.servings}
            />

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Instructions</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((inst, index) => {
                  const previousGroup = recipe.instructions[index - 1]?.group;
                  const showGroup = inst.group && inst.group !== previousGroup;
                  return (
                    <li key={inst.step} id={`step-${inst.step}`} className="scroll-mt-24">
                      {showGroup && (
                        <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-3">
                          {inst.group}
                        </h3>
                      )}
                      <div className="flex gap-4">
                        <span
                          className="shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-semibold flex items-center justify-center print:bg-white print:text-black print:border print:border-black"
                          aria-hidden="true"
                        >
                          {inst.step}
                        </span>
                        <div className="flex-1">
                          <p className="text-neutral-700 leading-7 pt-0.5">{inst.text}</p>
                          {inst.image && (
                            <div className="relative w-full h-48 sm:h-60 rounded-xl overflow-hidden mt-3">
                              <Image
                                src={inst.image}
                                alt={inst.imageAlt ?? `${recipe.title} — step ${inst.step}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 700px"
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {recipe.nutrition && (
              <div className="mt-8 pt-5 border-t border-neutral-200">
                <h2 className="text-base font-semibold text-neutral-900 mb-3">
                  Nutrition <span className="font-normal text-neutral-500">(per serving)</span>
                </h2>
                <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {(
                    [
                      ['Calories', recipe.nutrition.calories],
                      ['Carbs', recipe.nutrition.carbohydrates],
                      ['Protein', recipe.nutrition.protein],
                      ['Fat', recipe.nutrition.fat],
                      ['Fibre', recipe.nutrition.fiber],
                      ['Sodium', recipe.nutrition.sodium],
                    ] as const
                  )
                    .filter(([, value]) => Boolean(value))
                    .map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs text-neutral-500">{label}</dt>
                        <dd className="font-medium text-neutral-800">{value}</dd>
                      </div>
                    ))}
                </dl>
                {recipe.nutrition.source && (
                  <p className="text-xs text-neutral-400 mt-2">
                    Estimated values. Source: {recipe.nutrition.source}
                  </p>
                )}
              </div>
            )}
          </section>

          {recipe.tips.length > 0 && (
            <section
              id="tips"
              className="scroll-mt-24 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8"
            >
              <h2 className="text-base font-semibold text-amber-900 mb-3">Expert Tips</h2>
              <ol className="space-y-2 list-decimal list-outside pl-5 marker:text-amber-600 marker:font-semibold">
                {recipe.tips.map((tip) => (
                  <li key={tip} className="text-sm text-amber-800 leading-6 pl-1">
                    {tip}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {recipe.servingSuggestions && (
            <section id="serving" className="scroll-mt-24 mb-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-neutral-900 mb-3">
                <Utensils className="w-5 h-5 text-red-600" aria-hidden="true" />
                Serving Suggestions
              </h2>
              <p className="text-neutral-600 leading-7">{recipe.servingSuggestions}</p>
            </section>
          )}

          {recipe.storage && (
            <section id="storage" className="scroll-mt-24 mb-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-neutral-900 mb-3">
                <Refrigerator className="w-5 h-5 text-red-600" aria-hidden="true" />
                Storage &amp; Reheating
              </h2>
              <p className="text-neutral-600 leading-7">{recipe.storage}</p>
            </section>
          )}

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 mb-10 print:hidden">
            <p className="text-sm text-red-900 font-medium">
              Made with Tangry — authentic Jaipur spices
            </p>
            <Link
              href={recipe.productLink.href}
              className="shrink-0 bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {recipe.productLink.label}
            </Link>
          </div>

          <RecipeRating slug={recipe.slug} />

          {otherRecipes.length > 0 && (
            <section id="more-recipes" className="scroll-mt-24 print:hidden">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">More Recipes</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {otherRecipes.map((r) => (
                  <RecipeCard key={r.slug} recipe={r} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
