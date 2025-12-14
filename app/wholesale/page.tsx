'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Building2, Users, Package, TrendingUp, Phone, Mail } from 'lucide-react';

export default function WholesalePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    businessType: '',
    estimatedMonthlyVolume: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Wholesale inquiry:', formData);
    alert('Thank you for your interest! Our team will contact you within 24 hours.');
  };

  const benefits = [
    {
      icon: Package,
      title: 'Bulk Pricing',
      description: 'Competitive wholesale rates for large orders'
    },
    {
      icon: TrendingUp,
      title: 'Consistent Supply',
      description: 'Reliable inventory for your business needs'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Personal account manager for B2B clients'
    },
    {
      icon: Building2,
      title: 'Custom Packaging',
      description: 'Private labeling options available'
    }
  ];

  return (
    <main className="text-gray-800 bg-[#FAFAFA] min-h-screen">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white py-20 mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Partner with India's Leading Spice Brand
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses who trust Tangry for quality spices and masalas
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#inquiry-form" 
                className="bg-white text-[#D32F2F] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition text-center"
              >
                Request a Quote
              </a>
              <a 
                href="tel:+919876543210" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#D32F2F] transition text-center"
              >
                Call Us Now
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
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Who We Serve
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Restaurants & Hotels', desc: 'Bulk supplies for commercial kitchens' },
              { title: 'Retailers & Distributors', desc: 'Wholesale pricing for resellers' },
              { title: 'Food Manufacturers', desc: 'Custom blends and packaging' }
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

            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="10-digit number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="GSTIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  >
                    <option value="">Select type</option>
                    <option value="restaurant">Restaurant/Hotel</option>
                    <option value="retailer">Retailer/Distributor</option>
                    <option value="manufacturer">Food Manufacturer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Monthly Volume
                </label>
                <select
                  value={formData.estimatedMonthlyVolume}
                  onChange={(e) => setFormData({...formData, estimatedMonthlyVolume: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                >
                  <option value="">Select range</option>
                  <option value="0-50kg">0-50 kg</option>
                  <option value="50-100kg">50-100 kg</option>
                  <option value="100-500kg">100-500 kg</option>
                  <option value="500kg+">500+ kg</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D32F2F] text-white py-4 rounded-full font-bold text-lg hover:bg-[#B71C1C] transition shadow-lg"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <a href="tel:+919876543210" className="flex items-center justify-center space-x-3">
              <Phone size={24} />
              <span className="text-lg">+91 98765 43210</span>
            </a>
            <a href="mailto:wholesale@tangryspices.com" className="flex items-center justify-center space-x-3">
              <Mail size={24} />
              <span className="text-lg">wholesale@tangryspices.com</span>
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
    </main>
  );
}

