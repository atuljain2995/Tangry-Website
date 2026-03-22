export type MarketplaceLinks = {
  amazon: string;
  bigbasket: string;
  blinkit: string;
};

/** Default search URLs until brand storefront links are set in env. */
const DEFAULTS: MarketplaceLinks = {
  amazon: 'https://www.amazon.in/s?k=tangry+spices',
  bigbasket: 'https://www.bigbasket.com/ps/?q=tangry',
  blinkit: 'https://blinkit.com/s/?q=tangry',
};

export function resolveMarketplaceLinks(): MarketplaceLinks {
  return {
    amazon: process.env.NEXT_PUBLIC_TANGRY_AMAZON_URL?.trim() || DEFAULTS.amazon,
    bigbasket: process.env.NEXT_PUBLIC_TANGRY_BIGBASKET_URL?.trim() || DEFAULTS.bigbasket,
    blinkit: process.env.NEXT_PUBLIC_TANGRY_BLINKIT_URL?.trim() || DEFAULTS.blinkit,
  };
}
