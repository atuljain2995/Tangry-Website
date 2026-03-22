'use client';

import { Mail } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/constants';

export const Newsletter = () => {
  return (
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border-4 border-orange-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
              <Mail size={14} /> Stay Updated
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
              Join The Spice Squad
            </h2>
            <p className="text-gray-600 font-medium">
              Get offers and spice tips by email. Follow{' '}
              <a
                href="https://www.instagram.com/tangryspices"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold hover:underline"
              >
                @tangryspices
              </a>{' '}
              for recipes and behind-the-scenes from Jaipur.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <a
              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent('Subscribe me to Tangry updates')}&body=${encodeURIComponent('Please add my email to your newsletter list.\n\nMy email: ')}`}
              className="flex-1 inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg whitespace-nowrap text-center"
            >
              Subscribe via email
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-50 transition whitespace-nowrap text-center"
            >
              Contact form
            </a>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            We respect your inbox — no spam, only Tangry updates you can use.
          </p>
        </div>
      </div>
    </section>
  );
};
