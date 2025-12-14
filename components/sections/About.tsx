import { CheckCircle, Leaf, ShieldCheck, MapPin } from 'lucide-react';
import { IndiaMap } from '../ui/IndiaMap';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-900 text-white rounded-t-[3rem] relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-wider mb-4">
              <MapPin size={18} /> Source Code
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none">
              NOT FACTORY MADE. <br/>
              <span className="text-gray-500">VILLAGE GROWN.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
              We don&apos;t buy from middlemen. We adopt farms. For our turmeric, we partnered with 
              the <strong>Lakadong Farmers Collective</strong> in Meghalaya. We pay them 20% above market rate 
              to ensure they never use chemical fertilizers.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <Leaf className="text-green-400 mb-3" size={28} />
                <h4 className="font-bold text-xl mb-1">0% Filler</h4>
                <p className="text-sm text-gray-500">Just pure spice.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <ShieldCheck className="text-blue-400 mb-3" size={28} />
                <h4 className="font-bold text-xl mb-1">Lab Tested</h4>
                <p className="text-sm text-gray-500">Heavy metal free.</p>
              </div>
            </div>
            
            {/* Key Points */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">Scientifically graded ingredients</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">Hygienically packed for freshness</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">No artificial colors or preservatives</span>
              </div>
            </div>
          </div>
          
          {/* India Map Component */}
          <div className="relative flex justify-center items-center">
            <IndiaMap />
          </div>
        </div>
      </div>
    </section>
  );
};
