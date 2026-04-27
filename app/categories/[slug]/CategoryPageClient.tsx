'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { StructuredData } from '@/components/seo/StructuredData';
import { getBreadcrumbSchema } from '@/lib/utils/schema';
import type { ProductExtended } from '@/lib/types/database';

type CategoryPageClientProps = {
  category: {
    slug: string;
    title: string;
    description: string;
    chipLabel?: string | null;
  };
  products: ProductExtended[];
};

const CATEGORY_GUIDES: Record<
  string,
  {
    intro: string;
    uses: string[];
    buyingTip: string;
    wholesaleAngle: string;
  }
> = {
  'spices-masalas': {
    intro:
      'Tangry masalas are blended in Jaipur for everyday Indian cooking, street-food counters, restaurants, and home kitchens that want reliable taste without unnecessary fillers.',
    uses: [
      'Use dabeli and pav bhaji masala for snack counters, cafes, and weekend family meals.',
      'Choose sambhar, chai, and regional blends when you need consistent flavor batch after batch.',
      'Keep smaller packs for home trials and speak to us about bulk packs for restaurant prep.',
    ],
    buyingTip:
      'If you are buying for a commercial kitchen, start with 100 g or 200 g packs for tasting, then move to bulk pricing once the recipe is finalized.',
    wholesaleAngle:
      'Restaurants, hotels, caterers, and retailers can request repeat-supply pricing for high-rotation masalas.',
  },
  'ready-to-eat': {
    intro:
      'Ready-to-eat powders and finishing spices help cooks add quick flavor to snacks, chaas, chutneys, tiffin meals, and street-food style dishes.',
    uses: [
      'Sprinkle gun powder, jeeravan, and chaas masala directly on finished dishes.',
      'Use vada pav chutney and snack masalas for quick food-service prep without grinding every morning.',
      'Keep ready powders near the serving station so flavor stays consistent across shifts.',
    ],
    buyingTip:
      'For families, start with one finishing spice and one snack masala. For food outlets, compare usage per day before selecting pack size.',
    wholesaleAngle:
      'Cloud kitchens and quick-service counters can standardize taste with repeatable ready-powder batches.',
  },
  essentials: {
    intro:
      'Essential spices like turmeric and jeera form the base of Indian cooking, so freshness, color, aroma, and clean packing matter more than flashy discounts.',
    uses: [
      'Use turmeric in dal, sabzi, marinades, pickles, and daily tadka.',
      'Use cumin and everyday essentials for home kitchens, hotel prep, and restaurant gravies.',
      'Store essentials in airtight jars away from heat so aroma and color last longer.',
    ],
    buyingTip:
      'Buy smaller packs if your monthly usage is low. High-volume kitchens should buy larger packs only when storage is dry and airtight.',
    wholesaleAngle:
      'Retailers and commercial kitchens can request steady supply of essentials for monthly rotation.',
  },
  pickles: {
    intro:
      'Tangry pickles bring homestyle Rajasthani flavor to paratha, dal chawal, poha, khichdi, tiffins, thalis, and hotel breakfast counters.',
    uses: [
      'Sweet mango relish works well with paratha, thepla, poori, and simple dal rice.',
      'Sweet lemon pickle adds a balanced sweet-tangy note for family meals and thali service.',
      'Green chilli pickle is best for customers who want a sharper, spicier side with snacks and meals.',
    ],
    buyingTip:
      'Choose sweet mango or lemon for family-friendly meals. Choose green chilli when you want a bolder pickle for spice-loving customers.',
    wholesaleAngle:
      'Hotels, restaurants, and retailers can ask for pickle supply for thalis, breakfast counters, grocery shelves, and gifting packs.',
  },
};

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const guide = CATEGORY_GUIDES[category.slug];

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.tangryspices.com' },
    { name: 'Products', url: 'https://www.tangryspices.com/products' },
    { name: category.title, url: `https://www.tangryspices.com/categories/${category.slug}` },
  ];

  return (
    <>
      <StructuredData data={[getBreadcrumbSchema(breadcrumbs)]} />
      <main className="page-shell-white">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />

        <section className="bg-[#FFF8F3] pt-32 pb-12 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Category
            </p>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-6xl dark:text-neutral-100">
              {category.title}
            </h1>
            <p className="max-w-3xl text-lg text-gray-600 dark:text-neutral-300">
              {category.description}
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/products"
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-500"
              >
                View all products
              </Link>
              <Link
                href={`/products?category=${category.slug}`}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Browse filtered catalog
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <p className="mb-8 text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{products.length}</span>{' '}
            {products.length === 1 ? 'product' : 'products'} in {category.title}.
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                No products in this category yet
              </h2>
              <p className="mb-6 text-gray-600">
                This category page is live, but the product list is currently empty.
              </p>
              <Link
                href="/products"
                className="inline-flex rounded-full bg-[#D32F2F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B71C1C]"
              >
                Explore all products
              </Link>
            </div>
          )}

          {guide && (
            <section className="mt-16 grid gap-8 rounded-2xl border border-orange-100 bg-[#FFF8F3] p-6 md:grid-cols-[1.4fr_1fr] md:p-10 dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                  Buying guide
                </p>
                <h2 className="mb-4 text-2xl font-black tracking-tight text-gray-900 md:text-3xl dark:text-neutral-100">
                  How to choose {category.title.toLowerCase()} from Tangry
                </h2>
                <p className="mb-5 text-gray-700 leading-8 dark:text-neutral-300">{guide.intro}</p>
                <ul className="space-y-3 text-gray-700 dark:text-neutral-300">
                  {guide.uses.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-neutral-950">
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-neutral-100">
                  Practical buying tip
                </h3>
                <p className="mb-5 text-sm leading-7 text-gray-600 dark:text-neutral-300">
                  {guide.buyingTip}
                </p>
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-neutral-100">
                  For restaurants and retailers
                </h3>
                <p className="mb-5 text-sm leading-7 text-gray-600 dark:text-neutral-300">
                  {guide.wholesaleAngle}
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/wholesale"
                    className="rounded-full bg-[#D32F2F] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#B71C1C]"
                  >
                    Ask for bulk pricing
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-gray-300 px-5 py-3 text-center text-sm font-bold text-gray-800 transition hover:border-gray-500 dark:text-neutral-100"
                  >
                    Talk to Tangry
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}
