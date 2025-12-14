import { ArrowRight, Clock, Utensils } from 'lucide-react';
import { RECIPES } from '@/lib/data/products';

export const Recipes = () => {
  return (
    <section id="recipes" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-[#D32F2F] font-bold uppercase tracking-wider text-sm">Culinary Corner</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Cook with Tangry</h2>
          </div>
          <a href="#" className="hidden md:flex items-center text-gray-600 hover:text-[#D32F2F] font-medium mt-4 md:mt-0">
            View All Recipes <ArrowRight size={16} className="ml-1" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {RECIPES.map(recipe => (
            <div key={recipe.id} className="group cursor-pointer">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-200">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <Utensils className="text-gray-400 w-12 h-12" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded text-xs font-bold text-[#D32F2F]">
                  {recipe.tag}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D32F2F] transition">{recipe.title}</h3>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <Clock size={14} className="mr-1" /> {recipe.time} &nbsp;|&nbsp; Using {recipe.masala}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <a href="#" className="inline-flex items-center text-gray-600 hover:text-[#D32F2F] font-medium">
            View All Recipes <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

