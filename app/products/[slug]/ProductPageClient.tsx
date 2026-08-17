'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductDetail } from '@/components/ecommerce/ProductDetail';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { ProductReviews } from '@/components/ecommerce/ProductReviews';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import type { Recipe } from '@/lib/data/recipes';
import { ProductExtended } from '@/lib/types/database';

interface ProductPageClientProps {
  product: ProductExtended;
  relatedProducts: ProductExtended[];
  relatedRecipes: Recipe[];
  categoryUrl: string;
  categoryLabel: string;
}

export function ProductPageClient({
  product,
  relatedProducts,
  relatedRecipes,
  categoryUrl,
  categoryLabel,
}: ProductPageClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <main className="page-shell">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />

        {/* Spacing for fixed header */}
        <div className="pt-20">
          <ProductDetail
            product={product}
            categoryUrl={categoryUrl}
            categoryLabel={categoryLabel}
          />
        </div>

        <ProductReviews productId={product.id} />

        {relatedRecipes.length > 0 && (
          <section className="bg-neutral-50 py-12">
            <div className="container mx-auto px-6">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Recipes using {product.name}
              </h2>
              <p className="mb-8 text-gray-600">
                Step-by-step recipes we cook and test with this masala.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.slug} recipe={recipe} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
