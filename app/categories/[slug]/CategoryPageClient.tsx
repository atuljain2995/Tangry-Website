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

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            Showing <span className="font-bold text-gray-900">{products.length}</span> {products.length === 1 ? 'product' : 'products'} in {category.title}.
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">No products in this category yet</h2>
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
        </div>

        <Footer />
      </main>
    </>
  );
}