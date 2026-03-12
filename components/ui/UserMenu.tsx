'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, LayoutDashboard, ShoppingBag, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

const HOVER_CLOSE_DELAY = 120;

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleEnter = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  useEffect(() => () => clearCloseTimer(), []);

  // When not logged in (or still loading), show icon + Sign in / Sign up dropdown (hover)
  if (!user) {
    return (
      <div
        className="relative z-[60]"
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Account menu — Sign in or Sign up"
          title="Sign in or create account"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full bg-gray-300 animate-pulse block" aria-hidden />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
        {open && (
          <div
            className="absolute right-0 top-full pt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-xl py-1 min-w-[12rem] z-[100]"
            role="menu"
          >
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              role="menuitem"
            >
              <User className="w-4 h-4" />
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              role="menuitem"
            >
              <User className="w-4 h-4" />
              Sign up
            </Link>
          </div>
        )}
      </div>
    );
  }

  const displayName = profile?.name || profile?.email || user.email || 'Account';

  return (
    <div
      className="relative z-[60]"
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors px-2 py-1.5"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <User className="w-4 h-4 text-orange-600" />
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full pt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-[100]">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            href="/account"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="w-4 h-4" />
            Account
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
          </Link>
          {profile?.role === 'admin' && (
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
