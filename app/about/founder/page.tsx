'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { StructuredData } from '@/components/seo/StructuredData';
import { ArrowLeft, MapPin, Award, Heart } from 'lucide-react';

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Maya Jain',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Tangry Spices',
    url: 'https://www.tangryspices.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
  },
  description:
    'Maya Jain founded Tangry Spices to bring authentic, filler-free Rajasthani masalas to every Indian kitchen.',
};

const MILESTONES = [
  {
    year: '2025',
    title: 'The Idea',
    text: 'Noticed most packaged masalas contained fillers, artificial colours, and stale ingredients. Decided to make something better.',
  },
  {
    year: '2025',
    title: 'Production Begins',
    text: 'Set up a small-batch blending unit on Khatipura Road, Jhotwara. Obtained FSSAI license and ISO 22000 certification.',
  },
  {
    year: '2026',
    title: 'Online Launch',
    text: 'Launched tangryspices.com with direct-to-consumer shipping across India. Listed on Flipkart.',
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Zero Fillers',
    text: 'Every packet is 100% pure spice — no starch, no sawdust, no shortcuts.',
  },
  {
    icon: Award,
    title: 'Certified Quality',
    text: 'FSSAI licensed (12225026001713) and ISO 22000 food safety certified.',
  },
  {
    icon: MapPin,
    title: 'Jaipur Roots',
    text: 'Sourced from farms across Rajasthan, Madhya Pradesh, Kerala, and Karnataka. Blended and packed in Jhotwara.',
  },
];

export default function FounderPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="page-shell">
      <StructuredData data={founderSchema} />
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero */}
      <section className="pt-32 pb-16 container mx-auto px-4">
        <Link
          href="/about"
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to About
        </Link>

        <div className="max-w-3xl">
          <p className="text-orange-600 text-[11px] font-bold uppercase tracking-widest mb-2">
            The person behind Tangry
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Meet Maya Jain
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 border-l-4 border-orange-400 pl-5">
            I started Tangry with one belief: the masalas you buy should taste exactly like the ones
            your family grinds at home. No fillers, no shortcuts — just real spice.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
            Why I Started Tangry
          </h2>
          <div className="space-y-5 text-base leading-7 text-gray-600 dark:text-neutral-300">
            <p>
              Growing up in Jaipur, the kitchen always smelled of fresh-ground spices — my mother
              would toast cumin, blend garam masala by hand, and adjust every pinch by instinct.
              When I moved out and started buying packaged masalas, something was missing. The
              colour came from artificial dyes. The aroma was flat. The taste was diluted with
              fillers I couldn&apos;t identify.
            </p>
            <p>
              I spoke to kirana store owners, restaurant chefs, and home cooks. The complaint was
              the same: &quot;packaged masala doesn&apos;t taste like home-ground.&quot; So I
              decided to fix that — starting with a small production unit in Jhotwara, sourcing
              whole spices directly from farms, and blending in small batches to preserve the
              natural oils.
            </p>
            <p>
              The name &quot;Tangry&quot; captures what we aim for — that sharp, authentic{' '}
              <em>tang</em> of real spices that makes every dish come alive. Taste of Home.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-10">
            The Journey So Far
          </h2>
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {m.year}
                  </span>
                  {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-orange-200 mt-2" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-bold text-gray-900 dark:text-neutral-100 mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-10">
            What I Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-neutral-100 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
            Ready to Taste the Difference?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Try our small-batch masalas — made the way your grandmother would approve.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition hover:border-gray-400"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
