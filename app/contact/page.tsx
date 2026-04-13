'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { submitContact } from '@/lib/actions/contact';
import { COMPANY_INFO } from '@/lib/data/constants';
import { Mail, Phone, MapPin } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const result = await submitContact(formData);

    if (result.success) {
      setStatus('success');
      analytics.trackFormSubmission('contact', true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }
  };

  return (
    <main className="page-shell">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-6 py-20 mt-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>

        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto mb-12">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Get in Touch</h2>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-[#D32F2F]"
              >
                <Mail size={20} />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="flex items-center gap-3 text-gray-700 hover:text-[#D32F2F] mt-3"
              >
                <Phone size={20} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <p className="flex items-start gap-3 text-gray-700 mt-3">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </p>
              <p className="text-sm text-gray-600 mt-3">{COMPANY_INFO.certifications.join(' · ')}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  placeholder="10-digit number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  placeholder="What is this regarding?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  placeholder="Your message..."
                />
              </div>
              {status === 'success' && (
                <p className="text-green-600 font-medium">Thank you! We&apos;ll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#D32F2F] text-white py-4 rounded-full font-bold hover:bg-[#B71C1C] transition disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-0 sm:px-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center sm:text-left">Find us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 sm:h-80 bg-gray-100">
            <iframe
              title="Tangry — Jhotwara, Jaipur"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY_INFO.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-center sm:text-left mt-3 text-sm text-gray-600">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold hover:underline"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
