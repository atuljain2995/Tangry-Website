'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { Clock, ChefHat, Users, Search } from 'lucide-react';
import Link from 'next/link';

// Extended recipe data
const recipes = [
  {
    id: 1,
    slug: 'paneer-butter-masala',
    title: 'Paneer Butter Masala',
    description: 'Creamy, rich North Indian curry with soft paneer cubes',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'North Indian',
    cuisine: 'Indian',
    spices: ['Garam Masala', 'Red Chilli Powder', 'Turmeric'],
    image: '/recipes/paneer-butter-masala.jpg',
    featured: true
  },
  {
    id: 2,
    slug: 'chicken-biryani',
    title: 'Chicken Biryani',
    description: 'Aromatic rice dish layered with spiced chicken',
    prepTime: '30 mins',
    cookTime: '45 mins',
    servings: 6,
    difficulty: 'Medium',
    category: 'Rice',
    cuisine: 'Indian',
    spices: ['Biryani Masala', 'Garam Masala'],
    image: '/recipes/chicken-biryani.jpg',
    featured: true
  },
  {
    id: 3,
    slug: 'dal-tadka',
    title: 'Dal Tadka',
    description: 'Comforting lentil curry with aromatic tempering',
    prepTime: '10 mins',
    cookTime: '30 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Vegetarian',
    cuisine: 'Indian',
    spices: ['Turmeric', 'Cumin', 'Red Chilli Powder'],
    image: '/recipes/dal-tadka.jpg',
    featured: false
  },
  {
    id: 4,
    slug: 'chole-masala',
    title: 'Chole Masala',
    description: 'Spicy chickpea curry perfect with bhature',
    prepTime: '20 mins',
    cookTime: '40 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'North Indian',
    cuisine: 'Indian',
    spices: ['Chole Masala', 'Garam Masala'],
    image: '/recipes/chole-masala.jpg',
    featured: false
  },
  {
    id: 5,
    slug: 'butter-chicken',
    title: 'Butter Chicken',
    description: 'Creamy tomato-based chicken curry',
    prepTime: '25 mins',
    cookTime: '35 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Non-Vegetarian',
    cuisine: 'Indian',
    spices: ['Garam Masala', 'Kasuri Methi'],
    image: '/recipes/butter-chicken.jpg',
    featured: true
  },
  {
    id: 6,
    slug: 'pav-bhaji',
    title: 'Pav Bhaji',
    description: 'Mumbai street food - spiced mashed vegetables',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Street Food',
    cuisine: 'Indian',
    spices: ['Pav Bhaji Masala'],
    image: '/recipes/pav-bhaji.jpg',
    featured: false
  }
];

const categories = ['All', 'North Indian', 'South Indian', 'Street Food', 'Vegetarian', 'Non-Vegetarian', 'Rice'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export default function RecipesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipes
  let filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const featuredRecipes = recipes.filter(r => r.featured);

  return (
    <main className="text-gray-800 bg-[#FAFAFA] min-h-screen">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white py-16 mt-20">
        <div className="container mx-auto px-6 text-center">
          <ChefHat size={64} className="mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Delicious Recipes</h1>
          <p className="text-lg md:text-xl opacity-90">
            Cook authentic Indian dishes with Tangry Spices
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Search & Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Category:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
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

          {/* Difficulty Filter */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Difficulty:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedDifficulty === difficulty
                      ? 'bg-[#D32F2F] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#D32F2F]'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Recipes */}
        {selectedCategory === 'All' && selectedDifficulty === 'All' && searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Recipes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredRecipes.map(recipe => (
                <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                    <div className="relative h-48 bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Recipe Image
                      </div>
                      <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-bold">
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D32F2F] transition">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {recipe.cookTime}
                        </span>
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {recipe.servings} servings
                        </span>
                        <span className={`px-2 py-1 rounded font-semibold ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            All Recipes ({filteredRecipes.length})
          </h2>
          {filteredRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                    <div className="relative h-48 bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Recipe Image
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-[#D32F2F] text-white px-2 py-1 rounded font-semibold">
                          {recipe.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D32F2F] transition">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.spices.slice(0, 2).map(spice => (
                          <span key={spice} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                            {spice}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {recipe.prepTime} + {recipe.cookTime}
                        </span>
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {recipe.servings} servings
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No recipes found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

