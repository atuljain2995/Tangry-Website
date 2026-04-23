'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, LayoutDashboard, ShoppingBag, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // When not logged in (or still loading), show icon + Sign in / Sign up dropdown.
  if (!user) {
    return (
      <div className="relative z-[60]">
        <button
          type="button"
          onClick={handleToggle}
          className="relative z-[110] flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors focus:outline-none dark:text-neutral-300"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Account menu — Sign in or Sign up"
          title="Sign in or create account"
        >
          {loading ? (
            <span className="block h-5 w-5 animate-pulse rounded-full bg-gray-300 dark:bg-neutral-600" aria-hidden />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] cursor-default"
              aria-label="Close account menu"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute right-0 top-full z-[100] min-w-[12rem] w-48 rounded-lg border border-gray-200 bg-white py-1 pt-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
              role="menu"
            >
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 dark:text-neutral-200 dark:hover:bg-orange-950/40 dark:hover:text-orange-400"
                role="menuitem"
              >
                <User className="w-4 h-4" />
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 dark:text-neutral-200 dark:hover:bg-orange-950/40 dark:hover:text-orange-400"
                role="menuitem"
              >
                <User className="w-4 h-4" />
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  const displayName = profile?.name || profile?.email || user.email || 'Account';

  return (
    <div className="relative z-[60]">
      <button
        type="button"
        onClick={handleToggle}
        className="relative z-[110] flex min-h-10 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-gray-700 transition-colors focus:outline-none dark:text-neutral-300"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
        title="Open account menu"
      >
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-orange-100 ring-2 ring-white dark:bg-orange-950 dark:ring-neutral-800">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded dynamic URL
            <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-orange-700">
              {(displayName || 'U').slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[90] cursor-default"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-[100] w-56 rounded-lg border border-gray-200 bg-white py-1 pt-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-2 dark:border-neutral-800">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-orange-100 dark:bg-orange-950">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-base font-semibold text-orange-700">
                    {(displayName || 'U').slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{displayName}</p>
                <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{user.email}</p>
              </div>
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <User className="w-4 h-4" />
              Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </Link>
            {profile?.role === 'admin' && (
              <Link
                href="/admin/products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                analytics.trackAuth('logout');
                signOut();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
