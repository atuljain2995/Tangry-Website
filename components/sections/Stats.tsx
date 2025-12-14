import { Award, Globe, Home, Factory } from 'lucide-react';

export const Stats = () => {
  return (
    <section id="about" className="py-12 bg-white -mt-10 relative z-10 shadow-lg mx-4 md:mx-20 rounded-xl border-t-4 border-[#FFC107]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
        <div className="p-4">
          <Home className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" />
          <h3 className="text-3xl font-bold text-gray-800">25M+</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Households Daily</p>
        </div>
        <div className="p-4">
          <Factory className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" />
          <h3 className="text-3xl font-bold text-gray-800">4B+</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Packs Sold Yearly</p>
        </div>
        <div className="p-4">
          <Globe className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" />
          <h3 className="text-3xl font-bold text-gray-800">80+</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Countries Worldwide</p>
        </div>
        <div className="p-4">
          <Award className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" />
          <h3 className="text-3xl font-bold text-gray-800">75+</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Product Varieties</p>
        </div>
      </div>
    </section>
  );
};

