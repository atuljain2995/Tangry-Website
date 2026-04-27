import { Award, ShieldCheck, MapPin, Truck } from 'lucide-react';

export const Stats = () => {
  return (
    <section
      id="trust"
      className="relative z-10 mx-3 mt-8 rounded-2xl border-t-4 border-[#FFC107] bg-white py-10 shadow-lg sm:mx-4 sm:mt-10 md:-mt-8 md:mx-auto md:max-w-5xl md:rounded-xl md:py-9 md:shadow-md lg:-mt-10 lg:max-w-6xl lg:py-10 xl:max-w-[72rem]"
    >
      <div className="px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header: pill + location — capped width on desktop for readability */}
        <div className="mx-auto max-w-md text-center sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          <div className="mx-auto flex w-full flex-col items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-1 sm:rounded-full sm:px-5 sm:py-2.5 md:px-6 md:py-3">
            <div className="flex w-full items-start justify-center gap-2 sm:w-auto sm:items-center">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-orange-900 sm:mt-0 md:h-5 md:w-5"
                aria-hidden
              />
              <span className="text-left text-[13px] font-semibold leading-snug text-orange-900 sm:text-sm md:text-[15px]">
                <span className="block sm:inline">FSSAI Licensed</span>{' '}
                <span className="block text-[11px] font-medium text-orange-800/90 sm:inline sm:text-sm md:text-[13px]">
                  (12225026001713)
                </span>
              </span>
            </div>
            <span className="hidden text-orange-400 sm:inline" aria-hidden>
              ·
            </span>
            <span className="text-[13px] font-semibold text-orange-900 sm:text-sm md:text-[15px]">
              ISO 22000 Certified
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-[18rem] text-pretty text-xs leading-relaxed text-gray-500 sm:mt-3 sm:max-w-none md:mt-4 md:text-sm md:font-medium md:text-gray-600">
            Tangry · Jhotwara, Jaipur, Rajasthan
          </p>
        </div>

        {/* Feature tiles — equal columns, moderate padding, no huge empty footer */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-4 md:mt-8 md:max-w-none md:grid-cols-4 md:gap-4 lg:mt-9 lg:gap-5">
          <div className="flex min-h-0 flex-col items-center justify-center rounded-xl bg-gray-50/90 px-4 py-5 text-center sm:min-h-[132px] sm:px-4 sm:py-5 md:min-h-[128px] md:px-3 md:py-5 lg:min-h-[136px] lg:px-4">
            <ShieldCheck
              className="mb-2.5 h-9 w-9 text-[#D32F2F] md:mb-2 md:h-8 md:w-8 lg:h-9 lg:w-9"
              aria-hidden
            />
            <h2 className="text-base font-bold text-gray-800 md:text-lg">FSSAI</h2>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px] lg:text-xs">
              Licensed facility
            </p>
          </div>
          <div className="flex min-h-0 flex-col items-center justify-center rounded-xl bg-gray-50/90 px-4 py-5 text-center sm:min-h-[132px] sm:px-4 sm:py-5 md:min-h-[128px] md:px-3 md:py-5 lg:min-h-[136px] lg:px-4">
            <Award
              className="mb-2.5 h-9 w-9 text-[#D32F2F] md:mb-2 md:h-8 md:w-8 lg:h-9 lg:w-9"
              aria-hidden
            />
            <h2 className="text-base font-bold text-gray-800 md:text-lg">ISO 22000</h2>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px] lg:text-xs">
              Food safety
            </p>
          </div>
          <div className="flex min-h-0 flex-col items-center justify-center rounded-xl bg-gray-50/90 px-4 py-5 text-center sm:min-h-[132px] sm:px-4 sm:py-5 md:min-h-[128px] md:px-3 md:py-5 lg:min-h-[136px] lg:px-4">
            <MapPin
              className="mb-2.5 h-9 w-9 text-[#D32F2F] md:mb-2 md:h-8 md:w-8 lg:h-9 lg:w-9"
              aria-hidden
            />
            <h2 className="text-base font-bold text-gray-800 md:text-lg">Jaipur</h2>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px] lg:text-xs">
              Blended & packed
            </p>
          </div>
          <div className="flex min-h-0 flex-col items-center justify-center rounded-xl bg-gray-50/90 px-4 py-5 text-center sm:min-h-[132px] sm:px-4 sm:py-5 md:min-h-[128px] md:px-3 md:py-5 lg:min-h-[136px] lg:px-4">
            <Truck
              className="mb-2.5 h-9 w-9 text-[#D32F2F] md:mb-2 md:h-8 md:w-8 lg:h-9 lg:w-9"
              aria-hidden
            />
            <h2 className="text-base font-bold text-gray-800 md:text-lg">Pan-India</h2>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px] lg:text-xs">
              Shipping available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
