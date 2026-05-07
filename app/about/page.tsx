import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { COMPANY_INFO } from '@/lib/data/constants';
import { MapPin, Leaf, ShieldCheck, Award, Heart, Package, Users, Target } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: Leaf,
    title: 'Zero Fillers',
    description:
      'Every packet contains 100% pure spice. No starch, no sawdust, no artificial colours — just the real thing.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: ShieldCheck,
    title: 'FSSAI & ISO 22000',
    description:
      'Licensed under FSSAI (12225026001713) and ISO 22000 food safety management system certified.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: Package,
    title: 'Small-Batch Blending',
    description:
      'We blend in small batches to preserve the natural oils and aroma of each spice. Freshness you can smell.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
];

const milestones = [
  { year: '2025', event: 'Tangry founded in Jhotwara, Jaipur as a home-kitchen masala brand' },
  {
    year: '2025',
    event:
      'FSSAI license & ISO 22000 certification obtained; production facility set up on Khatipura Road',
  },
  { year: '2026', event: 'Launched online store — shipping across India' },
];

export default function AboutPage() {
  return (
    <PageShell>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-gray-900" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider mb-4">
              <MapPin size={18} /> Jhotwara, Jaipur
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Rooted in Rajasthan. <span className="text-gray-400">Built for Every Kitchen.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              {COMPANY_INFO.brandName} is crafted in Jhotwara, Jaipur. We blend masalas and
              ready-to-eat powders in small batches, source ingredients from trusted partners across
              India, and pack under FSSAI supervision — so what reaches your shelf matches what we
              serve at home.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
              Our Story
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
              Tangry started with a simple belief: the masalas you buy should taste exactly like the
              ones your family grinds at home. We noticed that most packaged spices were diluted
              with fillers, artificial colours, and stale ingredients. So we set out to change that.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mt-4">
              From a small production unit on Khatipura Road in Jhotwara, we carefully source whole
              spices from farms across Rajasthan, Madhya Pradesh, Kerala, and Karnataka. Each batch
              is cleaned, graded, blended, and packed in-house — nothing is outsourced.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mt-4">
              The name &quot;Tangry&quot; captures what we aim for — that sharp, authentic tang of
              real spices that makes every dish come alive. <em>Taste of Home.</em>
            </p>
            <Link
              href="/about/founder"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Meet the Founder — Maya Jain
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-neutral-900 dark:text-white">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v) => (
              <div
                key={v.title}
                className={`${v.bg} rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 text-center`}
              >
                <v.icon className={`${v.color} mb-4 mx-auto`} size={32} />
                <h3 className="font-bold text-xl mb-2 text-neutral-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Milestones */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-neutral-900 dark:text-white">
            Our Journey
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative border-l-2 border-orange-300 dark:border-orange-700 pl-8 space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[2.6rem] top-1 w-5 h-5 rounded-full bg-orange-500 border-4 border-white dark:border-neutral-950" />
                  <span className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                    {m.year}
                  </span>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1 text-lg">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-10 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Target className="text-orange-500 mb-4" size={36} />
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                Our Mission
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                To make authentic, filler-free masalas accessible to every Indian household — from
                Rajasthani kitchens to homes across the country — at honest prices, without
                compromising on taste or safety.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-10 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Heart className="text-red-500 mb-4" size={36} />
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                Our Vision
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                To become India&apos;s most trusted small-batch spice brand — known for purity,
                transparency, and the taste of home-ground masalas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
            Certifications & Compliance
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-12 max-w-xl mx-auto">
            Food safety isn&apos;t a feature — it&apos;s the foundation. Every product we ship meets
            these standards.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              <Award className="text-green-600 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                FSSAI Licensed
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                License No: <strong>12225026001713</strong>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Food Safety and Standards Authority of India
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              <ShieldCheck className="text-blue-600 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                ISO 22000 Certified
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Food Safety Management System
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                International Organization for Standardization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where to Find Us */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-neutral-900 dark:text-white">
            Where to Find Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <MapPin className="text-orange-500 mx-auto mb-3" size={28} />
              <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">Address</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {COMPANY_INFO.address}
              </p>
            </div>
            <div className="text-center">
              <Users className="text-orange-500 mx-auto mb-3" size={28} />
              <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">
                Legal Entity
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {COMPANY_INFO.legalName}
              </p>
              <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                Proprietorship, Jaipur
              </p>
            </div>
            <div className="text-center">
              <Heart className="text-orange-500 mx-auto mb-3" size={28} />
              <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">
                Get in Touch
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{COMPANY_INFO.phone}</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{COMPANY_INFO.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <TrustBadges variant="grid" />
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
              Visit Our Store
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Walk into our production unit in Jhotwara, Jaipur. See how we blend, taste fresh
              samples, and pick up products directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Map */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-neutral-700 aspect-[4/3]">
              <iframe
                title="Tangry Spices — Jhotwara, Jaipur"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3830.2644173353583!2d75.75710867562384!3d26.935058359129464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db375832d3cb3%3A0x120c439a534ae39d!2sJain%20Electricals!5e1!3m2!1sen!2sin!4v1776817059884!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Store Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Address</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="text-orange-500 mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                    Nearby Landmarks
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Near Khatipura Road, 2 km from Jhotwara Railway Station, 8 km from Jaipur
                    Junction
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-orange-500 mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Opening Hours</h3>
                  <div className="text-neutral-600 dark:text-neutral-400 space-y-1">
                    <p>Mon – Fri: 9:00 AM – 6:00 PM</p>
                    <p>Saturday: 10:00 AM – 4:00 PM</p>
                    <p className="text-red-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="text-orange-500 mt-1 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Walk-in Perks</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Free tasting of all products. No shipping charges on in-store purchases.
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps?q=26.9124,75.7873"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-700 transition w-fit"
              >
                <MapPin size={18} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Taste the Difference?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-lg mx-auto">
            Explore our range of authentic masalas, ready powders, and pickles — made the way your
            grandmother would approve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
