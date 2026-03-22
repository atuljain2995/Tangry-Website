'use client';

import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { NavLink } from '../ui/NavLink';
import { CartIcon } from '../ecommerce/CartIcon';
import { UserMenu } from '../ui/UserMenu';

interface HeaderProps {
  onMenuOpen: () => void;
}

export const Header = ({ onMenuOpen }: HeaderProps) => {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 overflow-visible">
        <div className="flex items-center justify-between overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center transform -rotate-6 shadow-sm">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-orange-600 transition-colors">
              TANGRY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-bold text-sm uppercase tracking-wide text-gray-600">
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/recipes">Recipes</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/wholesale">Wholesale</NavLink>
            <NavLink href="#about">Our Village</NavLink>
          </div>

          {/* Right Side Actions - overflow-visible so dropdown isn't clipped */}
          <div className="flex items-center space-x-4 overflow-visible">
            <button className="hidden md:block text-gray-600 hover:text-orange-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <UserMenu />
            <CartIcon />
            <button 
              className="md:hidden text-gray-900 hover:text-orange-600 transition-colors"
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
