'use client';

import { Sparkles, ArrowRight, Zap, Star, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductExtended } from '@/lib/types/database';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils/database';

interface HeroProps {
  products?: ProductExtended[];
}

/* ── Reusable product card (shared between mobile & desktop) ── */
function PromoCard({
  product,
  className = '',
  sizes = '180px',
  priority = false,
}: {
  product: ProductExtended;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const v = product.variants[0];
  const disc = v ? calculateDiscountPercentage(v.price, v.compareAtPrice) : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative block rounded-3xl border border-slate-100 bg-white p-3 shadow-xl transition-all duration-300 active:scale-[0.97] hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 sm:p-4 lg:p-5 ${className}`}
    >
      <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-700 sm:mb-4">
        {product.isBestSeller && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md dark:bg-orange-600 sm:left-3 sm:top-3 sm:px-4 sm:py-1.5 sm:text-xs">
            Best Seller
          </span>
        )}
        {disc > 0 && !product.isBestSeller && (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold text-white shadow-md dark:bg-green-600 sm:right-3 sm:top-3 sm:px-4 sm:py-1.5 sm:text-xs">
            {disc}% OFF
          </span>
        )}
        {product.isNew && !product.isBestSeller && disc <= 0 && (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-blue-500 px-3 py-1 text-[10px] font-bold text-white shadow-md sm:right-3 sm:top-3 sm:px-4 sm:py-1.5 sm:text-xs">
            NEW
          </span>
        )}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={sizes}
          priority={priority}
        />
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 sm:text-xs">
          {product.category || 'Spices'}
        </div>
        <h4 className="mt-1 text-sm font-bold leading-snug text-slate-900 line-clamp-1 dark:text-neutral-100 sm:mt-1.5 sm:text-base lg:text-lg">
          {product.name}
        </h4>
        {v && (
          <div className="mt-1 text-base font-black text-slate-900 dark:text-neutral-50 sm:mt-2 sm:text-lg lg:text-xl">
            {formatCurrency(v.price)}
            {v.compareAtPrice && (
              <span className="ml-1.5 text-xs font-normal text-slate-400 line-through dark:text-neutral-500 sm:text-sm">
                {formatCurrency(v.compareAtPrice)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Fallback card when no product data ── */
function FallbackCard({
  emoji,
  label,
  sub,
  className = '',
}: {
  emoji: string;
  label: string;
  sub: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-100 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-800 sm:p-4 lg:p-5 ${className}`}
    >
      <div className="mb-3 flex aspect-[4/5] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-red-50 text-4xl dark:from-orange-900/30 dark:to-red-900/20 sm:mb-4 sm:text-5xl">
        {emoji}
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 sm:text-xs">
          {label}
        </div>
        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-neutral-100 sm:mt-1.5 sm:text-base lg:text-lg">
          {sub}
        </div>
      </div>
    </div>
  );
}

export const Hero = ({ products = [] }: HeroProps) => {
  // Prefer products explicitly marked for hero section
  const heroProducts = products.filter((p) => p.isHeroProduct && p.images?.[0]);

  let promo1: ProductExtended | null = null;
  let promo2: ProductExtended | null = null;

  if (heroProducts.length >= 2) {
    promo1 = heroProducts[0];
    promo2 = heroProducts[1];
  } else if (heroProducts.length === 1) {
    promo1 = heroProducts[0];
    promo2 = products.find((p) => p !== promo1 && p.images?.[0]) || null;
  } else {
    // Fallback: auto-pick one spice + one pickle
    const spice =
      products.find((p) => p.category?.toLowerCase() !== 'pickles' && p.images?.[0]) ?? null;
    const pickle =
      products.find((p) => p.category?.toLowerCase() === 'pickles' && p.images?.[0]) ?? null;
    promo1 = spice || products.find((p) => p.images?.[0]) || null;
    promo2 = pickle || products.filter((p) => p !== promo1).find((p) => p.images?.[0]) || null;
  }

  return (
    <section className="relative overflow-hidden bg-[#FFF8F3] pb-14 pt-16 sm:pb-16 md:pb-20 md:pt-20 dark:bg-neutral-900">
      <h1 className="sr-only">Authentic Jaipur flavours from Tangry Spices</h1>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-10 top-20 h-72 w-72 animate-pulse rounded-full bg-orange-400 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 h-96 w-96 animate-pulse rounded-full bg-orange-400 blur-3xl delay-700"></div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 rounded-bl-full bg-gradient-to-l from-orange-100/50 to-transparent dark:from-orange-900/10 sm:block"></div>

      {/* ═══════════ MOBILE LAYOUT (< lg) ═══════════ */}
      <div className="relative container mx-auto max-w-7xl px-4 pb-8 pt-6 sm:pb-12 sm:pt-10 lg:hidden">
        {/* Badge — centered */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            <Zap className="h-3 w-3 fill-current" />
            TASTE OF HOME · NO PRESERVATIVES
          </div>
        </div>

        {/* Heading — centered */}
        <div
          aria-hidden="true"
          className="mb-4 text-center text-[2.25rem] font-black leading-[1.08] tracking-tight text-slate-900 dark:text-neutral-50 sm:text-5xl"
        >
          AUTHENTIC{' '}
          <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-serif italic text-transparent">
            JAIPUR
          </span>{' '}
          FLAVOURS
        </div>

        {/* Description — centered */}
        <p className="mx-auto mb-7 max-w-sm text-center text-[15px] leading-relaxed text-slate-600 dark:text-neutral-300 sm:max-w-md sm:text-base">
          Masalas, ready-to-eat powders, and pickles from Tangry Spices—small-batch blends rooted in
          Jaipur. FSSAI licensed, ISO 22000 certified, no unnecessary fillers.
        </p>

        {/* Full-width stacked CTAs */}
        <div className="mx-auto flex max-w-sm flex-col gap-2.5">
          <Link
            href="/products"
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] dark:bg-neutral-100 dark:text-neutral-900"
          >
            Shop All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products?category=pickles"
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-[15px] font-bold text-slate-900 transition-all active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            Explore Pickles
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-7 flex max-w-sm items-center justify-between border-t border-slate-200/80 pt-5 dark:border-neutral-700">
          <div className="text-center">
            <div className="text-lg font-black text-slate-900 dark:text-neutral-50">25+</div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-neutral-400">
              Masalas &amp; pickles
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-neutral-700"></div>
          <div className="text-center">
            <div className="text-lg font-black text-slate-900 dark:text-neutral-50">Jaipur</div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-neutral-400">
              Blended &amp; packed
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-neutral-700"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-lg font-black text-slate-900 dark:text-neutral-50">
              ISO <ShieldCheck className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-neutral-400">
              Licensed facility
            </div>
          </div>
        </div>

        {/* Overlapping product cards — same style as desktop */}
        <div className="relative mx-auto mt-8 flex h-[420px] w-full max-w-xs items-center justify-center sm:h-[480px] sm:max-w-sm">
          {promo1 ? (
            <PromoCard
              product={promo1}
              className="absolute left-0 top-0 z-10 w-[48%] -rotate-6"
              sizes="(max-width: 640px) 150px, 180px"
              priority
            />
          ) : (
            <FallbackCard
              emoji="🌶️"
              label="Masalas"
              sub="Dabeli · Pav Bhaji"
              className="absolute left-0 top-0 z-10 w-[48%] -rotate-6"
            />
          )}

          {promo2 ? (
            <PromoCard
              product={promo2}
              className="absolute right-0 top-10 z-20 w-[52%] rotate-3"
              sizes="(max-width: 640px) 170px, 200px"
              priority
            />
          ) : (
            <FallbackCard
              emoji="🫙"
              label="Pickles"
              sub="Mango · Lemon"
              className="absolute right-0 top-10 z-20 w-[52%] rotate-3"
            />
          )}

          {/* Review pill */}
          <div
            className="absolute -bottom-6 left-1/2 z-30 -translate-x-1/2 animate-bounce rounded-full border border-orange-100 bg-white px-4 py-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            style={{ animationDuration: '3s' }}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-neutral-100">
                &ldquo;Just like home!&rdquo;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ DESKTOP LAYOUT (lg+) ═══════════ */}
      <div className="relative container mx-auto hidden max-w-7xl px-4 pb-40 pt-10 lg:block">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text column */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold tracking-widest text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              <Zap className="h-3.5 w-3.5 fill-current" />
              TASTE OF HOME · NO PRESERVATIVES
            </div>

            <div
              aria-hidden="true"
              className="mb-6 text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-neutral-50"
            >
              AUTHENTIC{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-serif italic text-transparent">
                JAIPUR
              </span>{' '}
              FLAVOURS
            </div>

            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-neutral-300">
              Masalas, ready-to-eat powders, and pickles from Tangry Spices—small-batch blends
              rooted in Jaipur. FSSAI licensed, ISO 22000 certified, no unnecessary fillers.
            </p>

            <div className="mb-12 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-orange-500 dark:hover:text-white"
              >
                Shop All Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products?category=pickles"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:border-orange-200 hover:bg-orange-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-orange-600 dark:hover:bg-neutral-700"
              >
                Explore Pickles
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-slate-200 pt-8 dark:border-neutral-700">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-neutral-50">25+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                  Masalas &amp; pickles
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-neutral-50">
                  Jaipur
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                  Blended &amp; packed
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-2xl font-black text-slate-900 dark:text-neutral-50">
                  ISO <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                  Licensed facility
                </div>
              </div>
            </div>
          </div>

          {/* Overlapping product cards */}
          <div className="relative mx-auto flex h-[560px] w-full max-w-lg items-start justify-center">
            {promo1 ? (
              <PromoCard
                product={promo1}
                className="absolute left-0 top-4 z-10 w-[42%] -rotate-6"
                sizes="220px"
                priority
              />
            ) : (
              <FallbackCard
                emoji="🌶️"
                label="Masalas"
                sub="Dabeli · Pav Bhaji"
                className="absolute left-0 top-4 z-10 w-[42%] -rotate-6"
              />
            )}

            {promo2 ? (
              <PromoCard
                product={promo2}
                className="absolute right-0 top-16 z-20 w-[48%] rotate-3"
                sizes="250px"
                priority
              />
            ) : (
              <FallbackCard
                emoji="🫙"
                label="Pickles"
                sub="Mango · Lemon"
                className="absolute right-0 top-16 z-20 w-[48%] rotate-3"
              />
            )}

            {/* Review pill — anchored below right card */}
            <div
              className="absolute bottom-4 right-4 z-30 animate-bounce rounded-full border border-orange-100 bg-white px-5 py-2.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
              style={{ animationDuration: '3s' }}
            >
              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-100">
                  &ldquo;Just like home!&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Ticker */}
      <div className="absolute bottom-1 left-0 z-[1] w-full origin-left -rotate-1 scale-105 overflow-hidden bg-black py-2.5 text-white shadow-lg sm:bottom-10 sm:py-3">
        <div className="animate-marquee flex gap-12 whitespace-nowrap text-sm font-bold uppercase tracking-widest">
          {[
            'Pure Spices',
            'Jaipur Made',
            'FSSAI Licensed',
            'Pure Spices',
            'Jaipur Made',
            'FSSAI Licensed',
            'Pure Spices',
            'Jaipur Made',
            'FSSAI Licensed',
          ].map((label, i) => (
            <span key={i} className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 fill-current text-orange-500" /> {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
