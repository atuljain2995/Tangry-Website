'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu } from 'lucide-react';
import { NavLink } from '../ui/NavLink';
import { CartIcon } from '../ecommerce/CartIcon';
import { UserMenu } from '../ui/UserMenu';
import { showBlogInNav, showRecipesInNav } from '@/lib/data/nav-flags';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface HeaderProps {
  onMenuOpen: () => void;
}

export const Header = ({ onMenuOpen }: HeaderProps) => {
  return (
    <header className="fixed w-full top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90">
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 overflow-visible">
        <div className="flex items-center justify-between overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* Desktop: full banner logo */}
            <Image
              src="/images/logo-full.jpg"
              alt="Tangry - Taste of Home"
              width={200}
              height={56}
              className="hidden md:block h-14 w-auto object-contain"
              priority
            />
            {/* Mobile/Tablet: icon only */}
            <Image
              src="/images/logo-mobile.jpg"
              alt="Tangry Spices"
              width={60}
              height={60}
              className="md:hidden h-11 w-11 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-bold text-sm uppercase tracking-wide text-gray-600 dark:text-neutral-300">
            <NavLink href="/products">Products</NavLink>
            {showRecipesInNav() && <NavLink href="/recipes">Recipes</NavLink>}
            {showBlogInNav() && <NavLink href="/blog">Blog</NavLink>}
            <NavLink href="/wholesale">Wholesale</NavLink>
            <NavLink href="/#our-story">Our Story</NavLink>
          </div>

          {/* Right Side Actions - overflow-visible so dropdown isn't clipped */}
          <div className="flex items-center space-x-2 overflow-visible sm:space-x-3 md:space-x-4">
            <ThemeToggle showLabel className="hidden sm:flex" />
            <Link
              href="/search"
              className="text-gray-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </Link>
            <UserMenu />
            <CartIcon />
            <button
              className="text-gray-900 transition-colors hover:text-orange-600 dark:text-neutral-100 md:hidden"
              onClick={onMenuOpen}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
