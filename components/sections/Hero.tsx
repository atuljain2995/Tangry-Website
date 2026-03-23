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
    <section className="relative min-h-[min(100dvh,920px)] md:min-h-screen bg-[#FFF8F3] overflow-hidden pb-14 pt-16 sm:pb-16 md:pb-20 md:pt-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto max-w-full px-5 sm:px-6 md:px-4 pt-12 pb-36 sm:pt-16 md:pt-20 sm:pb-32 md:pb-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 bg-orange-100/90 backdrop-blur-sm px-4 py-2.5 sm:px-6 sm:py-3 rounded-full mb-6 sm:mb-8 animate-pulse text-center sm:text-left sm:justify-start">
            <Zap className="h-4 w-4 shrink-0 text-orange-600 fill-current sm:h-5 sm:w-5" />
            <span className="text-orange-700 font-bold text-[11px] uppercase tracking-wide sm:text-sm sm:tracking-wider text-balance leading-snug">
              Taste of Home · No Preservatives · Natural
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-5 text-[2.125rem] font-black leading-[1.12] tracking-tight text-gray-900 sm:mb-6 sm:text-5xl sm:leading-[1.05] md:text-7xl md:leading-[0.95] lg:text-8xl">
            <span className="block sm:inline">
              AUTHENTIC{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                JAIPUR
              </span>
            </span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">FLAVOURS</span>
          </h1>

          {/* Description */}
          <p className="text-[0.9375rem] sm:text-lg md:text-xl text-gray-600 mb-7 sm:mb-10 max-w-2xl leading-[1.65] sm:leading-relaxed font-medium text-pretty">
            Masalas, ready-to-eat powders, and pickles from Tangry Spices—small-batch blends rooted in
            Jaipur. FSSAI licensed, ISO 22000 certified, no unnecessary fillers.
          </p>

          {/* CTA Buttons — extra right padding on small screens for fixed WhatsApp FAB */}
          <div className="mb-10 flex max-w-full flex-col gap-3 pr-14 sm:mb-12 sm:flex-row sm:gap-4 sm:pr-0">
            <Link 
              href="/products"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3.5 text-[0.9375rem] font-bold text-white shadow-xl transition-all hover:bg-orange-600 hover:shadow-orange-500/30 sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-base group"
            >
              Shop Spices
              <ArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#our-story"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-gray-900 bg-white px-6 py-3.5 text-[0.9375rem] font-bold text-gray-900 transition-all hover:bg-gray-50 sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-base group"
            >
              <Play className="mr-2 h-4 w-4 shrink-0 fill-current" />
              Our story
            </Link>
          </div>

          {/* Stats */}
          <div className="grid max-w-2xl grid-cols-1 gap-8 border-t border-gray-200/80 pt-8 sm:grid-cols-3 sm:gap-8 sm:border-0 sm:pt-0">
            <div>
              <div className="text-3xl font-black text-gray-900 sm:text-4xl mb-1.5 sm:mb-2">25+</div>
              <div className="text-sm font-medium text-gray-600 sm:text-base">Masalas & pickles</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 sm:text-4xl mb-1.5 sm:mb-2">Jaipur</div>
              <div className="text-sm font-medium text-gray-600 sm:text-base">Blended & packed</div>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight text-gray-900 sm:text-3xl md:text-4xl mb-1.5 sm:mb-2 whitespace-nowrap">
                FSSAI & ISO 22000
              </div>
              <div className="text-sm font-medium text-gray-600 sm:text-base">Licensed & certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Ticker */}
      <div className="absolute md:mb-10 bottom-6 left-0 z-[1] w-full origin-left scale-105 overflow-hidden bg-black py-2.5 text-white shadow-lg -rotate-1 sm:bottom-10 sm:py-3">
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
