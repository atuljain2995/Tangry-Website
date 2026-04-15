'use client';

import { X } from 'lucide-react';
import { NavLink } from '../ui/NavLink';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { showBlogInNav, showRecipesInNav } from '@/lib/data/nav-flags';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 dark:shadow-black/40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#D32F2F]">Menu</h2>
        <button type="button" onClick={onClose} className="text-gray-500 dark:text-neutral-400" aria-label="Close menu">
          <X size={24} />
        </button>
      </div>
      <NavLink href="/about" isMobile onClick={onClose}>About Us</NavLink>
      <NavLink href="/products" isMobile onClick={onClose}>Products</NavLink>
      <NavLink href="/search" isMobile onClick={onClose}>Search</NavLink>
      {showRecipesInNav() && (
        <NavLink href="/recipes" isMobile onClick={onClose}>Recipes</NavLink>
      )}
      {showBlogInNav() && (
        <NavLink href="/blog" isMobile onClick={onClose}>Blog</NavLink>
      )}
      <NavLink href="/wholesale" isMobile onClick={onClose}>Wholesale</NavLink>
      <NavLink href="/contact" isMobile onClick={onClose}>Contact</NavLink>

      <div className="mt-auto border-t border-gray-100 pt-6 dark:border-neutral-800 sm:hidden">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
          Appearance
        </p>
        <ThemeToggle showLabel />
      </div>
    </div>
  );
};
