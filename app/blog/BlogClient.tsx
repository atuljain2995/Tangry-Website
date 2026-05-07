'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import { blogCategories, blogPosts } from '@/lib/data/blog';

export function BlogClient() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof blogCategories)[number]>('All');

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap mt-8 gap-2 justify-center overflow-x-auto pb-2 no-scrollbar container mx-auto px-4">
        {blogCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize border whitespace-nowrap cursor-pointer ${
              selectedCategory === category
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-4 pb-16 mt-8">
        {/* Featured Post */}
        {selectedCategory === 'All' && filteredPosts.length > 0 && (
          <div className="mb-16">
            <article className="group flex flex-col md:flex-row rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg p-3 gap-3">
              <Link href={`/blog/${filteredPosts[0].slug}`} className="md:w-1/2 shrink-0">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </Link>

              <div className="px-3 md:px-5 py-4 flex flex-col justify-center flex-1">
                <p className="text-orange-600 text-[11px] font-bold uppercase tracking-widest mb-2">
                  {filteredPosts[0].category}
                </p>
                <Link href={`/blog/${filteredPosts[0].slug}`} className="group/link">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight group-hover/link:text-orange-700 transition-colors">
                    {filteredPosts[0].title}
                  </h2>
                </Link>
                <p className="text-gray-500 mb-5 text-base leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {filteredPosts[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {filteredPosts[0].readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${filteredPosts[0].slug}`}
                  className="inline-flex items-center gap-2 w-fit rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Read article <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(selectedCategory === 'All' ? 1 : 0).map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg p-3"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-52 rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>

              <div className="px-3 pt-4 pb-3 flex-1 flex flex-col">
                <p className="text-orange-600 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  {post.category}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug transition-colors group-hover:text-orange-700">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 mb-4 text-sm line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap=0.5"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
