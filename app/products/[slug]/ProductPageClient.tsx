'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductDetail } from '@/components/ecommerce/ProductDetail';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { StructuredData } from '@/components/seo/StructuredData';
import { getProductSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { ProductExtended } from '@/lib/types/database';

interface ProductPageClientProps {
  product: ProductExtended;
  relatedProducts: ProductExtended[];
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: 'Home', url: 'https://tangryspices.com' },
    { name: 'Products', url: 'https://tangryspices.com/products' },
    { name: product.category, url: `https://tangryspices.com/category/${product.category}` },
    { name: product.name, url: `https://tangryspices.com/products/${product.slug}` },
  ];

  return (
    <>
      <StructuredData data={[getProductSchema(product), getBreadcrumbSchema(breadcrumbs)]} />
      <main className="text-gray-800 bg-[#FAFAFA] min-h-screen">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />

        {/* Spacing for fixed header */}
        <div className="pt-20">
          <ProductDetail product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
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

