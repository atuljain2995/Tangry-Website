import { ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';

export const ProductCategories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#D32F2F] font-bold uppercase tracking-wider text-sm">Explore Our Range</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Products You Will Love</h2>
          <div className="w-24 h-1 bg-[#FFC107] mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCT_CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className={`${category.bgColor} rounded-2xl p-8 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#D32F2F]`}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{category.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {category.products.slice(0, 3).map((product, idx) => (
                  <span 
                    key={idx}
                    className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm"
                  >
                    {product}
                  </span>
                ))}
              </div>
              <a href="#products" className="text-[#D32F2F] font-semibold text-sm hover:text-[#B71C1C] flex items-center">
                View More <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

