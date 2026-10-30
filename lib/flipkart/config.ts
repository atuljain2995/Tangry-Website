export type FlipkartConfig = {
  apiBaseUrl: string;
  appId: string;
  appSecret: string;
  /** Public storefront / seller page link for “open on Flipkart”. */
  storefrontUrl: string | null;
};

const DEFAULT_API_BASE = 'https://api.flipkart.net';

export function getFlipkartConfig(): FlipkartConfig | null {
  const appId = process.env.FLIPKART_APP_ID?.trim();
  const appSecret = process.env.FLIPKART_APP_SECRET?.trim();
  if (!appId || !appSecret) return null;

  const apiBaseUrl = (process.env.FLIPKART_API_BASE_URL?.trim() || DEFAULT_API_BASE).replace(
    /\/$/,
    '',
  );

  const storefrontUrl =
    process.env.NEXT_PUBLIC_TANGRY_FLIPKART_URL?.trim() ||
    process.env.FLIPKART_STOREFRONT_URL?.trim() ||
    null;

  return { apiBaseUrl, appId, appSecret, storefrontUrl };
}

export function isFlipkartConfigured(): boolean {
  return getFlipkartConfig() !== null;
}
