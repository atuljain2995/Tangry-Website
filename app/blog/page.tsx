'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Sample blog posts - Replace with CMS or database
const blogPosts = [
  {
    id: 1,
    slug: 'health-benefits-turmeric',
    title: '10 Amazing Health Benefits of Turmeric',
    excerpt: 'Discover how this golden spice can transform your health with its powerful anti-inflammatory and antioxidant properties.',
    author: 'Dr. Priya Sharma',
    date: '2024-12-01',
    readTime: '5 min read',
    category: 'Health',
    image: '/blog/turmeric-health.jpg',
    tags: ['health', 'turmeric', 'wellness']
  },
  {
    id: 2,
    slug: 'authentic-garam-masala-recipe',
    title: 'How to Make Authentic Garam Masala at Home',
    excerpt: 'Learn the secret recipe behind the perfect garam masala blend that will elevate all your dishes.',
    author: 'Chef Ramesh Kumar',
    date: '2024-11-28',
    readTime: '7 min read',
    category: 'Recipes',
    image: '/blog/garam-masala.jpg',
    tags: ['recipe', 'garam masala', 'spices']
  },
  {
    id: 3,
    slug: 'difference-kashmiri-chilli',
    title: 'Kashmiri vs Regular Red Chilli: What\'s the Difference?',
    excerpt: 'Understand the unique characteristics of different chilli varieties and when to use each one.',
    author: 'Tangry Team',
    date: '2024-11-25',
    readTime: '4 min read',
    category: 'Education',
    image: '/blog/chilli-types.jpg',
    tags: ['education', 'chilli', 'spices']
  },
  {
    id: 4,
    slug: 'spice-storage-tips',
    title: '5 Essential Tips for Storing Spices to Maintain Freshness',
    excerpt: 'Keep your spices fresh and flavorful for longer with these simple storage techniques.',
    author: 'Tangry Team',
    date: '2024-11-20',
    readTime: '6 min read',
    category: 'Tips',
    image: '/blog/spice-storage.jpg',
    tags: ['tips', 'storage', 'freshness']
  },
  {
    id: 5,
    slug: 'indian-spices-guide',
    title: 'The Ultimate Guide to Indian Spices for Beginners',
    excerpt: 'A comprehensive introduction to the most commonly used spices in Indian cooking.',
    author: 'Neha Patel',
    date: '2024-11-15',
    readTime: '10 min read',
    category: 'Education',
    image: '/blog/spices-guide.jpg',
    tags: ['education', 'beginners', 'indian cuisine']
  },
  {
    id: 6,
    slug: 'biryani-masala-secrets',
    title: 'The Secret to Perfect Biryani Masala',
    excerpt: 'Master the art of creating restaurant-quality biryani with the right spice blend.',
    author: 'Chef Ramesh Kumar',
    date: '2024-11-10',
    readTime: '8 min read',
    category: 'Recipes',
    image: '/blog/biryani-secrets.jpg',
    tags: ['recipe', 'biryani', 'masala']
  }
];

const categories = ['All', 'Recipes', 'Health', 'Tips', 'Education'];

export default function BlogPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <main className="text-gray-800 bg-[#FAFAFA] min-h-screen">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white py-16 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Spice Stories & More</h1>
          <p className="text-lg md:text-xl opacity-90">
            Recipes, health tips, and everything about spices
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-[#D32F2F] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#D32F2F]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {selectedCategory === 'All' && filteredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <Link href={`/blog/${filteredPosts[0].slug}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Featured Image
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="inline-block bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full font-bold uppercase mb-3 w-fit">
                      {filteredPosts[0].category}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#D32F2F] transition">
                      {filteredPosts[0].title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-lg">{filteredPosts[0].excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <User size={16} className="mr-1" />
                        {filteredPosts[0].author}
                      </span>
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {filteredPosts[0].readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(selectedCategory === 'All' ? 1 : 0).map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-48 bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Blog Image
                  </div>
                  <span className="absolute top-4 left-4 bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D32F2F] transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <User size={14} className="mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 opacity-90">
            Get the latest recipes, tips, and spice stories delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-gray-900 focus:outline-none"
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-r-full font-bold hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

