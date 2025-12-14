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
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">
            The Stash
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Upgrade your pantry game with legitimate flavors.
          </p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl mt-6 md:mt-0 flex-wrap gap-2">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition capitalize ${
              activeCategory === 'all' 
                ? 'bg-white shadow-md text-black' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition capitalize ${
                activeCategory === category 
                  ? 'bg-white shadow-md text-black' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
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
