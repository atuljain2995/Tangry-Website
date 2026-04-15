'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ecommerce/ProductCard';
import { ProductExtended } from '@/lib/types/database';

interface FeaturedProductsProps {
  products: ProductExtended[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">
            The Stash
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Jaipur-made masalas, ready powders, and essentials.
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex mt-6 md:mt-0 gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize border whitespace-nowrap ${
              activeCategory === 'all' 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize border whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - max 2 rows (8 items) on homepage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredProducts.slice(0, 8).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-medium">No products found in this category.</p>
        </div>
      )}

      <div className="text-center mt-12">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-xl group"
        >
          View All Products
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
