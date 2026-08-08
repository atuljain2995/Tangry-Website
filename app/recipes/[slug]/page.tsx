import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Users, ChefHat, ArrowLeft, ArrowDown } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { getRecipeSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { recipes, getRecipe } from '@/lib/data/recipes';

const SITE_URL = 'https://www.tangryspices.com';

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

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
      images: [{ url: `${SITE_URL}${recipe.image}`, alt: recipe.imageAlt }],
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

  return (
    <>
      <StructuredData
        data={[
          getBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Recipes', url: `${SITE_URL}/recipes` },
            { name: recipe.title, url: `${SITE_URL}/recipes/${recipe.slug}` },
          ]),
          getRecipeSchema(recipe),
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

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500 mb-5">
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

          <div className="text-neutral-600 leading-7 mb-6 space-y-4">
            {recipe.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a
            href="#ingredients"
            className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-red-800 transition-colors mb-8 print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
            Jump to Recipe
          </a>

          <div className="flex flex-wrap gap-4 border-y border-neutral-200 py-4 mb-8 text-sm text-neutral-700">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" aria-hidden="true" />
              Prep: {recipe.prepTime} min
            </span>
            {recipe.cookTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600" aria-hidden="true" />
                Cook: {recipe.cookTime} min
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" aria-hidden="true" />
              Total: {totalTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-red-600" aria-hidden="true" />
              Serves {recipe.servings}
            </span>
            <span className="flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-red-600" aria-hidden="true" />
              {recipe.difficulty}
            </span>
          </div>

          <section id="ingredients" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="flex items-start gap-2 text-neutral-700">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0"
                    aria-hidden="true"
                  />
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Instructions</h2>
            <ol className="space-y-5">
              {recipe.instructions.map((inst) => (
                <li key={inst.step} id={`step-${inst.step}`} className="flex gap-4 scroll-mt-24">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-semibold flex items-center justify-center print:bg-white print:text-black print:border print:border-black"
                    aria-hidden="true"
                  >
                    {inst.step}
                  </span>
                  <p className="text-neutral-700 leading-7 pt-0.5">{inst.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {recipe.tips.length > 0 && (
            <section className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
              <h2 className="text-base font-semibold text-amber-900 mb-3">Tips &amp; Notes</h2>
              <ul className="space-y-2 list-disc list-outside pl-5 marker:text-amber-500">
                {recipe.tips.map((tip) => (
                  <li key={tip} className="text-sm text-amber-800 leading-6">
                    {tip}
                  </li>
                ))}
              </ul>
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

          {otherRecipes.length > 0 && (
            <section className="print:hidden">
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
