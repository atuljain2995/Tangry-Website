'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { ProductCategories } from '@/components/sections/ProductCategories';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { About } from '@/components/sections/About';
import { BuyOnline } from '@/components/sections/BuyOnline';
import { Recipes } from '@/components/sections/Recipes';
import { Newsletter } from '@/components/sections/Newsletter';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { StructuredData } from '@/components/seo/StructuredData';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/utils/schema';
import { ProductExtended } from '@/lib/types/database';

interface HomeClientProps {
  products: ProductExtended[];
}

export function HomeClient({ products }: HomeClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter featured products
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <>
      <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
      <main className="text-gray-800 bg-[#FAFAFA] min-h-screen">
        <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer />
        <Hero />
        <Stats />
        <ProductCategories />
        <FeaturedProducts products={featuredProducts} />
        <About />
        <BuyOnline />
        <Recipes />
        <Newsletter />
        
        <Footer />
      </main>
    </>
  );
}

