'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { StructuredData } from '@/components/seo/StructuredData';
import { getWebSiteSchema } from '@/lib/utils/schema';
import { ProductExtended } from '@/lib/types/database';
import type { MarketplaceLinks } from '@/lib/data/marketplaces';

// Lazy-load below-fold sections to reduce initial JS bundle and improve LCP/TBT
const ProductCategories = dynamic(() =>
  import('@/components/sections/ProductCategories').then((m) => ({ default: m.ProductCategories })),
);
const Testimonials = dynamic(() =>
  import('@/components/sections/Testimonials').then((m) => ({ default: m.Testimonials })),
);
const About = dynamic(() =>
  import('@/components/sections/About').then((m) => ({ default: m.About })),
);
const BuyOnline = dynamic(() =>
  import('@/components/sections/BuyOnline').then((m) => ({ default: m.BuyOnline })),
);
const Recipes = dynamic(() =>
  import('@/components/sections/Recipes').then((m) => ({ default: m.Recipes })),
);
const Newsletter = dynamic(() =>
  import('@/components/sections/Newsletter').then((m) => ({ default: m.Newsletter })),
);

interface HomeClientProps {
  products: ProductExtended[];
  marketplaceLinks: MarketplaceLinks;
}

export function HomeClient({ products, marketplaceLinks }: HomeClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter featured products
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <>
      <StructuredData data={[getWebSiteSchema()]} />
      <main className="page-shell">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />
        <Hero products={products} />
        <FeaturedProducts products={featuredProducts} />
        <ProductCategories />
        <Testimonials />
        <About />
        <BuyOnline links={marketplaceLinks} />
        {process.env.NEXT_PUBLIC_SHOW_RECIPES_NAV === 'true' && <Recipes />}
        <Newsletter />

        <Footer />
      </main>
    </>
  );
}
