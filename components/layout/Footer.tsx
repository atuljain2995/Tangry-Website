import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/data/constants';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tighter">
              {COMPANY_INFO.brandName.toUpperCase()}
            </h2>
            <p className="text-sm font-semibold text-orange-600 mb-3">{COMPANY_INFO.tagline}</p>
            <p className="text-gray-500 max-w-sm mb-2 font-medium text-sm">
              {COMPANY_INFO.legalName} · Jhotwara, Jaipur, Rajasthan
            </p>
            <p className="text-gray-500 max-w-sm mb-4 font-medium text-sm">
              {COMPANY_INFO.certifications.join(' · ')}
            </p>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition"
                aria-label="Tangry on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition"
                aria-label="Tangry on X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition"
                aria-label="Tangry on Facebook"
              >
                <Facebook size={20} />
              </a>
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
                <Link href="/recipes">Recipes</Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Help</h4>
            <ul className="space-y-3 text-gray-500 font-medium">
              <li className="hover:text-orange-600 transition">
                <Link href="/track-order">Track Order</Link>
              </li>
              <li className="hover:text-orange-600 transition">
                <Link href="/shipping-policy">Shipping Policy</Link>
              </li>
              <li className="hover:text-orange-600 transition">
                <Link href="/contact">Contact Us</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <a href={`mailto:${COMPANY_INFO.email}`}>Email Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} {COMPANY_INFO.legalName} ({COMPANY_INFO.brandName}). Made with spice in India.
          <div className="mt-2 space-x-6">
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact & policies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
