'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  User,
  MapPin,
  HelpCircle,
  LogOut,
  Store,
  Heart,
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/account/orders', label: 'Orders', icon: ClipboardList, section: 'My Orders' },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart, section: 'My Wishlist' },
  { href: '/account', label: 'Profile', icon: User, section: 'Personal Info' },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin, section: 'Addresses & Payments' },
  { href: '/account/help', label: 'Help', icon: HelpCircle, section: 'Help & Support' },
];

const NAV_SECTIONS = [
  {
    label: 'My Orders',
    items: [{ href: '/account/orders', label: 'Order History', icon: ClipboardList }],
  },
  {
    label: 'My Wishlist',
    items: [{ href: '/account/wishlist', label: 'Wishlist', icon: Heart }],
  },
  {
    label: 'Personal Info',
    items: [{ href: '/account', label: 'Profile', icon: User }],
  },
  {
    label: 'Addresses & Payments',
    items: [{ href: '/account/addresses', label: 'Saved Addresses', icon: MapPin }],
  },
  {
    label: 'Help & Support',
    items: [{ href: '/account/help', label: 'Help Centre', icon: HelpCircle }],
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Mobile: horizontal scrollable nav */}
      <aside className="lg:hidden">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          {user && (
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                  {user.name || user.email}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/" className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
                  <Store className="h-4 w-4" aria-hidden />
                </Link>
                <button type="button" onClick={() => signOut()} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">
                  <LogOut className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          )}
          <nav className="flex overflow-x-auto px-2 py-2 gap-1 scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop: full vertical sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          {user && (
            <div className="mb-5 border-b border-gray-100 pb-4 dark:border-neutral-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{user.email}</p>
            </div>
          )}

          <nav className="space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                              : 'text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-6 space-y-1 border-t border-gray-100 pt-4 dark:border-neutral-800">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Store className="h-4 w-4 shrink-0" aria-hidden />
              Back to Store
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
