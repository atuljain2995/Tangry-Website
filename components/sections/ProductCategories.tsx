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

        <div className="grid md:grid-cols-3 gap-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href="/products"
              className={`group bg-gradient-to-br ${category.gradient} rounded-2xl border ${category.accentBorder} p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden min-h-[220px]`}
            >
              {/* Text Content */}
              <div className="relative z-10 max-w-[60%]">
                <h3 className="text-xl md:text-[22px] font-bold text-gray-900 mb-2 leading-tight">{category.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{category.description}</p>
              </div>

              <div className="relative z-10">
                <span className="text-orange-600 font-bold text-sm group-hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors">
                  View products <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Circular Image */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/80 shadow-lg">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="192px"
                  />
                ) : (
                  <div className="w-full h-full bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-6xl md:text-7xl drop-shadow-sm">{category.emoji}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

