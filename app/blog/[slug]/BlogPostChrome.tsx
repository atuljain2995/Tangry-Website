'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { Footer } from '@/components/layout/Footer';

export function BlogPostChrome({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="page-shell-white">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />
      {children}
      <Footer />
    </main>
  );
}
