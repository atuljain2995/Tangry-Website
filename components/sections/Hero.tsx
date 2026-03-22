'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Zap } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#FFF8F3] overflow-hidden pt-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-100 backdrop-blur-sm px-6 py-3 rounded-full mb-8 animate-pulse">
            <Zap className="w-5 h-5 text-orange-600 fill-current" />
            <span className="text-orange-700 font-bold text-sm uppercase tracking-wider">
              Taste of Home . No Preservatives . Natural
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tight">
            AUTHENTIC{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              JAIPUR
            </span>
            <br />
            FLAVOURS
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed font-medium">
            Masalas, ready-to-eat powders, and pickles from Tangry Spices—small-batch blends rooted in
            Jaipur. FSSAI licensed, ISO 22000 certified, no unnecessary fillers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-500/30 group"
            >
              Shop Spices
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#our-story"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all border-2 border-gray-900 group"
            >
              <Play className="mr-2 w-4 h-4 fill-current" />
              Our story
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl">
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">25+</div>
              <div className="text-gray-600 font-medium">Masalas & pickles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">Jaipur</div>
              <div className="text-gray-600 font-medium">Blended & packed</div>
            </div>
            <div className="min-w-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2 whitespace-nowrap tracking-tight">
                FSSAI & ISO 22000
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">Licensed & certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Ticker */}
      <div className="absolute bottom-10 left-0 w-full bg-black text-white py-3 overflow-hidden -rotate-1 scale-105 origin-left shadow-lg">
        <div className="flex gap-12 animate-marquee whitespace-nowrap font-bold uppercase tracking-widest text-sm">
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Pure Spices</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Jaipur Made</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> FSSAI Licensed</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Pure Spices</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Jaipur Made</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> FSSAI Licensed</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Pure Spices</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> Jaipur Made</span>
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-orange-500 fill-current"/> FSSAI Licensed</span>
        </div>
      </div>
    </section>
  );
};
