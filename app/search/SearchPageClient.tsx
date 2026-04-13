'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Package, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import type { ProductExtended } from '@/lib/types/database';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { analytics } from '@/lib/analytics';

type SearchPageClientProps = {
  query: string;
  products: ProductExtended[];
};

const DEBOUNCE_MS = 350;

export function SearchPageClient({ query, products }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q')?.trim() ?? '';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [draft, setDraft] = useState(query);
  const debouncedDraft = useDebouncedValue(draft, DEBOUNCE_MS);
  const [isPending, startTransition] = useTransition();

  /** Latest `q` we asked the router to commit; used to ignore our own URL updates when syncing. */
  const pendingCommit = useRef<string | null>(null);

  useEffect(() => {
    if (debouncedDraft === urlQ) return;
    pendingCommit.current = debouncedDraft;
    startTransition(() => {
      router.replace(
        debouncedDraft ? `/search?q=${encodeURIComponent(debouncedDraft)}` : '/search',
        { scroll: false }
      );
    });
  }, [debouncedDraft, urlQ, router]);

  useEffect(() => {
    const pending = pendingCommit.current;
    if (pending !== null && pending === urlQ) {
      pendingCommit.current = null;
      return;
    }
    setDraft(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (query) analytics.trackSearch(query, products.length);
  }, [query, products.length]);

  function submitNow() {
    const next = draft.trim();
    pendingCommit.current = next;
    startTransition(() => {
      router.replace(next ? `/search?q=${encodeURIComponent(next)}` : '/search', { scroll: false });
    });
  }

  return (
    <main className="page-shell-white">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <section className="border-b border-orange-100 bg-[#FFF8F3] pt-28 pb-10 dark:border-orange-900/30 dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 md:text-4xl dark:text-neutral-100">
            Search products
          </h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-neutral-400">
            Results update as you type. You can still press Search or Enter for an immediate lookup.
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submitNow();
            }}
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                aria-hidden
              />
              <input
                type="search"
                name="q"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. dabeli, turmeric, pav bhaji…"
                autoComplete="off"
                enterKeyHint="search"
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-11 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-orange-900/40"
                aria-label="Search products"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[#D32F2F] px-6 py-3 font-bold text-white hover:bg-[#B71C1C] transition shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative">
        {isPending && (
          <div
            className="absolute top-0 right-4 flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400"
            aria-live="polite"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Updating…
          </div>
        )}

        {query.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <Package className="w-14 h-14 mx-auto text-orange-200 mb-4" aria-hidden />
            <p className="text-gray-600 font-medium">
              Start typing to search, or{' '}
              <Link href="/products" className="text-orange-600 font-semibold hover:underline">
                browse all products
              </Link>
              .
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            className={`text-center py-16 max-w-md mx-auto transition-opacity ${isPending ? 'opacity-60' : ''}`}
          >
            <p className="text-gray-700 text-lg font-medium mb-2">No matches for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-500 text-sm mb-6">Try another keyword or browse the full catalogue.</p>
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700 transition"
            >
              View all products
            </Link>
          </div>
        ) : (
          <>
            <p
              className={`text-sm text-gray-500 mb-8 font-medium transition-opacity ${isPending ? 'opacity-60' : ''}`}
            >
              {products.length} {products.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </p>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity ${isPending ? 'opacity-60' : ''}`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
