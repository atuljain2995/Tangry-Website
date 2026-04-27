import { ExternalLink } from 'lucide-react';
import type { MarketplaceLinks } from '@/lib/data/marketplaces';
import { FlipkartIcon } from '@/components/icons/FlipkartIcon';
import { analytics } from '@/lib/analytics';

type BuyOnlineProps = {
  links: MarketplaceLinks;
};

/** Flipkart brand blue (approximate) for CTA text on white button */
const FLIPKART_BLUE = '#2874f0';

export const BuyOnline = ({ links }: BuyOnlineProps) => {
  return (
    <>
      <section className="py-8 bg-[#FFD54F] overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="inline-flex items-center mx-8">
              <span className="text-2xl md:text-3xl font-bold text-[#D32F2F]">#HomeMadeNoPreservatives</span>
              <span className="text-2xl md:text-3xl font-bold text-gray-800 ml-2">Tangry</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Buy online</h2>
          <p className="text-red-100 mb-2 text-lg max-w-2xl mx-auto">
            Shop the full range here with secure checkout, or find us on Flipkart. Store links open in a new tab.
          </p>

          <div className="flex flex-wrap justify-center gap-6 items-center">
            <a
              href={links.flipkart}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackExternalMarketplace('flipkart', links.flipkart)}
              className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <FlipkartIcon className="h-7 w-7 shrink-0" />
              <span style={{ color: FLIPKART_BLUE }}>Flipkart</span>
              <ExternalLink className="h-5 w-5 shrink-0 text-gray-500" aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
