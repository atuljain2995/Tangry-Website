import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  {
    id: 'spices-masalas',
    title: 'Spices & Masalas',
    description: 'Regional blends from our Jaipur kitchen. Hand-mixed in small batches.',
    gradient: 'from-orange-50 to-amber-50',
    accentBorder: 'border-orange-200',
    image: '/images/categories/spices.png',
  },
  {
    id: 'ready-to-eat',
    title: 'Ready to Eat',
    description: 'Gun powder, chutneys, and finishing spices—ready to sprinkle or stir in.',
    gradient: 'from-yellow-50 to-amber-50',
    accentBorder: 'border-yellow-200',
    image: '/images/categories/ready-to-eat.png',
  },
  {
    id: 'essentials',
    title: 'Essentials',
    description: 'Turmeric, jeera, and staple spices for the everyday Indian kitchen.',
    gradient: 'from-blue-50 to-cyan-50',
    accentBorder: 'border-blue-200',
    image: '/images/categories/essentials.png',
  },
  {
    id: 'pickles',
    title: 'Authentic Pickles',
    description: 'Traditional lemon, mango, garlic, and mixed veg recipes from Rajasthan.',
    gradient: 'from-green-50 to-emerald-50',
    accentBorder: 'border-green-200',
    image: '/images/categories/pickles.png',
    emoji: '🫙',
  },
];

export const ProductCategories = () => {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-xs">Explore Our Range</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Products You Will Love</h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className={`group bg-gradient-to-br ${category.gradient} rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden m-3 rounded-xl" style={{ width: 'calc(100% - 1.5rem)' }}>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-white/60 flex items-center justify-center">
                    <span className="text-7xl drop-shadow-sm">{category.emoji}</span>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="px-5 pb-6 pt-2 flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{category.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{category.description}</p>
                <span className="text-gray-800 font-semibold text-sm group-hover:text-orange-600 inline-flex items-center gap-1.5 transition-colors mt-1">
                  View products <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

