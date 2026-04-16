'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Package, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import type { DbProductCategory } from '@/lib/db/queries';
import { ProductExtended } from '@/lib/types/database';

interface ProductsPageClientProps {
  products: ProductExtended[];
  categories: DbProductCategory[];
}

export function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('popular');

  // Derive selected category from URL search params (single source of truth)
  const selectedCategoryId = useMemo<'all' | string>(() => {
    const categoryParam = searchParams.get('category');
    if (!categoryParam) return 'all';
    const match = categories.find(
      (c) => c.slug === categoryParam || c.id === categoryParam || c.title.toLowerCase() === categoryParam.toLowerCase()
    );
    return match ? match.id : 'all';
  }, [searchParams, categories]);

  // Update URL when category filter changes
  const handleCategoryChange = useCallback((categoryId: 'all' | string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      const cat = categories.find((c) => c.id === categoryId);
      params.set('category', cat?.slug || categoryId);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [searchParams, categories, router, pathname]);

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

      {/* Hero Banner */}
      <section className="bg-[#FFF8F3] pt-32 pb-12 dark:bg-neutral-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> Premium Collection
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight text-gray-900 uppercase italic md:text-7xl dark:text-neutral-100">
            Shop Tangry
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium text-gray-600 dark:text-neutral-300">
            Masalas, ready powders, and essentials from Tangry, Jaipur. FSSAI licensed · ISO 22000.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          {/* Category Filter */}
          <div className="flex-1">
            <div className="flex bg-gray-100 p-1.5 rounded-xl flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize cursor-pointer ${
                  selectedCategoryId === 'all'
                    ? 'bg-white shadow-md text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize cursor-pointer ${
                    selectedCategoryId === category.id
                      ? 'bg-white shadow-md text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {category.chip_label || category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sort — custom chevron so spacing is consistent (native arrow ignores padding) */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
          Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
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
