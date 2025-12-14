'use client';

import { X } from 'lucide-react';
import { NavLink } from '../ui/NavLink';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col p-6 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-[#D32F2F]">Menu</h2>
        <button onClick={onClose} className="text-gray-500">
          <X size={24} />
        </button>
      </div>
      <NavLink href="/" isMobile onClick={onClose}>Home</NavLink>
      <NavLink href="/#about" isMobile onClick={onClose}>About Us</NavLink>
      <NavLink href="/products" isMobile onClick={onClose}>Products</NavLink>
      <NavLink href="/#eazy-chef" isMobile onClick={onClose}>Eazy Chef</NavLink>
      <NavLink href="/#tasteeto" isMobile onClick={onClose}>Tasteeto</NavLink>
      <NavLink href="/recipes" isMobile onClick={onClose}>Recipes</NavLink>
      <NavLink href="/blog" isMobile onClick={onClose}>Blog</NavLink>
      <NavLink href="/wholesale" isMobile onClick={onClose}>Wholesale</NavLink>
      <NavLink href="/#contact" isMobile onClick={onClose}>Contact</NavLink>
    </div>
  );
};
