import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/data/constants';

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="border-t border-gray-100 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/logo.png"
                alt="Tangry Spices"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-neutral-100">
                  {COMPANY_INFO.brandName.toUpperCase()}
                </h2>
                <p className="text-sm font-semibold text-orange-600">{COMPANY_INFO.tagline}</p>
              </div>
            </div>
            <p className="mb-2 max-w-sm text-sm font-medium text-gray-500 dark:text-neutral-400">
              {COMPANY_INFO.legalName} · Jhotwara, Jaipur, Rajasthan
            </p>
            <p className="mb-4 max-w-sm text-sm font-medium text-gray-500 dark:text-neutral-400">
              {COMPANY_INFO.certifications.join(' · ')}
            </p>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-orange-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-600 dark:hover:text-white"
                aria-label="Tangry on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-orange-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-600 dark:hover:text-white"
                aria-label="Tangry on X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-orange-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-600 dark:hover:text-white"
                aria-label="Tangry on Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-neutral-100">
              Shop
            </h3>
            <ul className="space-y-3 font-medium text-gray-500 dark:text-neutral-400">
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/products">All Spices</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/categories/pickles">Pickles</Link>
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition">
                <Link href="/wholesale">Corporate Orders</Link>
              </li>
              {process.env.NEXT_PUBLIC_SHOW_RECIPES_NAV === 'true' && (
                <li className="hover:text-orange-600 cursor-pointer transition">
                  <Link href="/recipes">Recipes</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-neutral-100">
              Company
            </h3>
            <ul className="space-y-3 font-medium text-gray-500 dark:text-neutral-400">
              <li className="hover:text-orange-600 transition">
                <Link href="/about">About Us</Link>
              </li>
              <li className="hover:text-orange-600 transition">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="hover:text-orange-600 transition">
                <Link href="/contact">Contact Us</Link>
              </li>
              <li className="hover:text-orange-600 transition">
                <Link href="/wholesale">Wholesale</Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-neutral-100">
              Help
            </h3>
            <ul className="space-y-3 font-medium text-gray-500 dark:text-neutral-400">
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

        <div className="mt-12 border-t border-gray-100 pt-8 text-center text-sm font-medium text-gray-600 dark:border-neutral-800 dark:text-neutral-400">
          &copy; {new Date().getFullYear()} {COMPANY_INFO.legalName} ({COMPANY_INFO.brandName}).
          Made with 🌶️ in India.
          <div className="mt-2 space-x-6">
            <Link
              href="/contact"
              className="transition hover:text-gray-900 dark:hover:text-neutral-100"
            >
              Contact & policies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
