import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { COMPANY_INFO } from '@/lib/data/constants';
import { Building2, Users, Package, TrendingUp, Phone, Mail } from 'lucide-react';
import { WholesaleForm } from './WholesaleForm';

const benefits = [
  {
    icon: Package,
    title: 'Bulk Pricing',
    description: 'Competitive wholesale rates for large orders',
  },
  {
    icon: TrendingUp,
    title: 'Consistent Supply',
    description: 'Reliable inventory for your business needs',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Personal account manager for B2B clients',
  },
  {
    icon: Building2,
    title: 'Custom Packaging',
    description: 'Private labeling options available',
  },
];

export default function WholesalePage() {
  return (
    <PageShell>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white py-20 mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Wholesale &amp; B2B — Tangry from Jaipur
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Bulk masalas, ready powders, and pickles from Tangry (FSSAI &amp; ISO 22000). Tell us
              your business type and volumes — we&apos;ll send a quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#inquiry-form"
                className="bg-white text-[#D32F2F] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition text-center"
              >
                Request a Quote
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#D32F2F] transition text-center"
              >
                Call {COMPANY_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Tangry for Wholesale?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#D32F2F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Who We Serve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Restaurants & Hotels', desc: 'Bulk supplies for commercial kitchens' },
              { title: 'Retailers & Distributors', desc: 'Wholesale pricing for resellers' },
              { title: 'Food Manufacturers', desc: 'Custom blends and packaging' },
            ].map((segment, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="font-bold text-2xl text-gray-900 mb-3">{segment.title}</h3>
                <p className="text-gray-600 mb-6">{segment.desc}</p>
                <a href="#inquiry-form" className="text-[#D32F2F] font-semibold hover:underline">
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Request a Wholesale Quote
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Fill out the form below and our B2B team will contact you within 24 hours
            </p>

            <WholesaleForm />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="flex items-center justify-center space-x-3"
            >
              <Phone size={24} />
              <span className="text-lg">{COMPANY_INFO.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.wholesaleEmail}`}
              className="flex items-center justify-center space-x-3"
            >
              <Mail size={24} />
              <span className="text-lg">{COMPANY_INFO.wholesaleEmail}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
