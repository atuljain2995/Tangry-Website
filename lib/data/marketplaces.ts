export type MarketplaceLinks = {
  flipkart: string;
};

/** Default Flipkart search until you set your seller store or product URL in env. */
const DEFAULT_FLIPKART =
  'https://www.flipkart.com/search?q=tangry+spices';

export function resolveMarketplaceLinks(): MarketplaceLinks {
  return {
    flipkart:
      process.env.NEXT_PUBLIC_TANGRY_FLIPKART_URL?.trim() || DEFAULT_FLIPKART,
  };
}
