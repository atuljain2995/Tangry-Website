import type { Metadata } from 'next';
import { Suspense } from 'react';
import { searchProducts } from '@/lib/db/queries';
import { SearchPageClient } from './SearchPageClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const raw = sp.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';
  if (q) {
    return {
      title: `Search: ${q}`,
      description: `Search results for “${q}” — Tangry Spices, Jaipur.`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: 'Search',
    description: 'Search masalas, ready powders, and pickles from Tangry Spices.',
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';
  const products = q.length > 0 ? await searchProducts(q) : [];

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-28 pb-12 text-center text-gray-500">
          Loading search…
        </div>
      }
    >
      <SearchPageClient query={q} products={products} />
    </Suspense>
  );
}
