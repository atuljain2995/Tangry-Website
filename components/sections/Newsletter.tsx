'use client';

import { Mail } from 'lucide-react';

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
              Get the latest recipes, offers, and spice tips delivered to your inbox!
            </p>
          </div>
          
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-700 font-medium"
              required
            />
            <button 
              type="submit"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Join <span className="font-bold text-gray-900">50K+</span> spice lovers who trust Tangry
          </p>
        </div>
      </div>
    </section>
  );
};
