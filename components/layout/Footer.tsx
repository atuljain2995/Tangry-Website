import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/constants';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">TANGRY</h2>
            <p className="text-gray-500 max-w-sm mb-6 font-medium">
              Making spices cool again. No preservatives, no fillers, just 100% authentic flavor for the modern kitchen.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition cursor-pointer">
                <Instagram size={20} />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition cursor-pointer">
                <Twitter size={20} />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition cursor-pointer">
                <Facebook size={20} />
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3 text-gray-500 font-medium">
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/products">All Spices</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/products">Gift Bundles</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/wholesale">Corporate Orders</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/blog">Recipes</Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Help</h4>
            <ul className="space-y-3 text-gray-500 font-medium">
              <li className="hover:text-orange-600 cursor-pointer transition">Track Order</li>
              <li className="hover:text-orange-600 cursor-pointer transition">Shipping Policy</li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <a href={`tel:${COMPANY_INFO.phone}`}>Contact Us</a>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <a href={`mailto:${COMPANY_INFO.email}`}>Email Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400 text-sm font-medium">
          &copy; 2024 Tangry Foods. Made with spice in India.
          <div className="mt-2 space-x-6">
            <a href="#" className="hover:text-gray-900 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
