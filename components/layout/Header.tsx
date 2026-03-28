'use client';

import Link from 'next/link';
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
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center transform -rotate-6 shadow-sm">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 transition-colors group-hover:text-orange-600 dark:text-neutral-100">
              TANGRY
            </span>
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
