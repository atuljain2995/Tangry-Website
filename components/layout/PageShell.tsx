'use client';

import { useState } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className = 'page-shell' }: PageShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className={className}>
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />
      {children}
    </main>
  );
}
