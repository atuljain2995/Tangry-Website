'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Package, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import type { DbProductCategory } from '@/lib/db/queries';
import { ProductExtended } from '@/lib/types/database';
import { analytics } from '@/lib/analytics';

interface ProductsPageClientProps {
  products: ProductExtended[];
  categories: DbProductCategory[];
}

export function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>(
    'popular',
  );

  // Derive selected category from URL search params (single source of truth)
  const selectedCategoryId = useMemo<'all' | string>(() => {
    const categoryParam = searchParams.get('category');
    if (!categoryParam) return 'all';
    const match = categories.find(
      (c) =>
        c.slug === categoryParam ||
        c.id === categoryParam ||
        c.title.toLowerCase() === categoryParam.toLowerCase(),
    );
    return match ? match.id : 'all';
  }, [searchParams, categories]);

  // Filter by DB category id, with title fallback for legacy rows without category_id
  let filteredProducts =
    selectedCategoryId === 'all'
      ? products
      : products.filter((p) => {
          if (p.categoryId === selectedCategoryId) return true;
          const meta = categories.find((c) => c.id === selectedCategoryId);
          return meta ? p.category === meta.title : false;
        });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'price-low':
        return a.variants[0].price - b.variants[0].price;
      case 'price-high':
        return b.variants[0].price - a.variants[0].price;
      case 'popular':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  return (
    <main className="page-shell-white">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero + SEO intro */}
      <section className="bg-[#FFF8F3] pt-32 pb-12 dark:bg-neutral-900">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> FSSAI Licensed · ISO 22000
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-neutral-100">
            Shop Authentic Rajasthani Masalas Online
          </h1>
          <div className="mx-auto max-w-3xl space-y-4 text-left text-base leading-7 text-gray-600 md:text-center md:text-lg dark:text-neutral-300">
            <p>
              Tangry Spices brings authentic{' '}
              <strong className="font-semibold text-gray-800 dark:text-neutral-100">
                Rajasthani masalas
              </strong>
              , ready powders, and pickles from our kitchen in Jhotwara,{' '}
              <strong className="font-semibold text-gray-800 dark:text-neutral-100">
                Jaipur
              </strong>
              . Whether you want to{' '}
              <strong className="font-semibold text-gray-800 dark:text-neutral-100">
                buy masala online
              </strong>{' '}
              for everyday cooking or stock a café, cloud kitchen, or hotel, our blends are packed
              for reliable flavour — dabeli masala, pav bhaji masala, gun powder podi, turmeric,
              and homestyle pickles.
            </p>
            <p>
              Browse by category:{' '}
              {categories.map((category, index) => (
                <span key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="font-semibold text-orange-700 underline-offset-2 hover:underline dark:text-orange-400"
                  >
                    {category.title}
                  </Link>
                  {index < categories.length - 1 ? ', ' : '. '}
                </span>
              ))}
              Every order above ₹500 ships free across India. From home cooks to restaurants,
              Tangry helps you cook with the taste of home.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Filters and Sorting */}
        <div className="mb-12 space-y-4">
          {/* Category Filter — scrollable strip */}
          <nav
            aria-label="Filter products by category"
            className="w-full overflow-x-auto no-scrollbar"
          >
            <div className="flex gap-2 w-max min-w-full">
              <Link
                href="/products"
                onClick={() => analytics.trackFilter('category', 'all')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize border whitespace-nowrap ${
                  selectedCategoryId === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  onClick={() => analytics.trackFilter('category', category.title)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize border whitespace-nowrap ${
                    selectedCategoryId === category.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {category.chip_label || category.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Sort */}
          <div className="relative self-start">
            <select
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value as typeof sortBy;
                analytics.trackFilter('sort', val);
                setSortBy(val);
              }}
              className="w-full min-w-[11.5rem] cursor-pointer appearance-none border-2 border-gray-200 bg-white py-3 pl-4 pr-11 text-sm font-bold text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </div>
        </div>

        {/* Product Count */}
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span>{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Package size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No products found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
