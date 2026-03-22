import { Award, ShieldCheck, MapPin, Truck } from 'lucide-react';

export const Stats = () => {
  return (
    <section
      id="trust"
      className="py-12 bg-white -mt-10 relative z-10 shadow-lg mx-4 md:mx-20 rounded-xl border-t-4 border-[#FFC107]"
    >
      <div className="px-4 pb-6 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-900">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
          <span>FSSAI Licensed (12225026001713)</span>
          <span className="text-orange-400">·</span>
          <span>ISO 22000 Certified</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">Maya Enterprises · Tangry · Jaipur, Rajasthan</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-2 pb-4">
        <div className="rounded-xl bg-gray-50/80 p-4">
          <ShieldCheck className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" aria-hidden />
          <h3 className="text-lg md:text-xl font-bold text-gray-800">FSSAI</h3>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Licensed facility</p>
        </div>
        <div className="rounded-xl bg-gray-50/80 p-4">
          <Award className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" aria-hidden />
          <h3 className="text-lg md:text-xl font-bold text-gray-800">ISO 22000</h3>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Food safety</p>
        </div>
        <div className="rounded-xl bg-gray-50/80 p-4">
          <MapPin className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" aria-hidden />
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Jaipur</h3>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Blended & packed</p>
        </div>
        <div className="rounded-xl bg-gray-50/80 p-4">
          <Truck className="mx-auto text-4xl text-[#D32F2F] mb-3 w-10 h-10" aria-hidden />
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Pan-India</h3>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Shipping available</p>
        </div>
      </div>
    </section>
  );
};
