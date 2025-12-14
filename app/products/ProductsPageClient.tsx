'use client';

import { useState } from 'react';
import { Package, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { ProductExtended } from '@/lib/types/database';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';

interface ProductsPageClientProps {
  products: ProductExtended[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('popular');

  // Filter products by category
  let filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
    <main className="text-gray-800 bg-white min-h-screen">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero Banner */}
      <section className="bg-[#FFF8F3] pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> Premium Collection
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">The Stash</h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Upgrade your pantry game with legitimate flavors. No fillers, no preservatives—just pure spice.
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
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition capitalize ${
                  selectedCategory === 'all'
                    ? 'bg-white shadow-md text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                All
              </button>
              {PRODUCT_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.title)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition capitalize ${
                    selectedCategory === category.title
                      ? 'bg-white shadow-md text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
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
