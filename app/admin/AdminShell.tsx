'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

type AdminShellProps = {
  children: React.ReactNode;
  profileEmail: string;
};

export function AdminShell({ children, profileEmail }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            href="/admin"
            className="truncate text-lg font-semibold text-gray-800 hover:text-orange-600"
          >
            Tangry Admin
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden max-w-[120px] truncate text-sm text-gray-500 sm:max-w-[180px] sm:inline">
            {profileEmail}
          </span>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-orange-600"
          >
            ← Store
          </Link>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] md:p-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
