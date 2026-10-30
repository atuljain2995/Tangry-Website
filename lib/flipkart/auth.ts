import { FlipkartApiError } from '@/lib/flipkart/errors';
import type { FlipkartConfig } from '@/lib/flipkart/config';

type TokenCache = {
  accessToken: string;
  expiresAtMs: number;
};

let cachedToken: TokenCache | null = null;

function clearTokenCache() {
  cachedToken = null;
}

export async function getFlipkartAccessToken(config: FlipkartConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs > now + 60_000) {
    return cachedToken.accessToken;
  }

  const credentials = Buffer.from(`${config.appId}:${config.appSecret}`).toString('base64');
  const url = new URL(`${config.apiBaseUrl}/oauth-service/oauth/token`);
  url.searchParams.set('grant_type', 'client_credentials');
  url.searchParams.set('scope', 'Seller_Api');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const body = await response.text();
  if (!response.ok) {
    clearTokenCache();
    throw new FlipkartApiError('Failed to obtain Flipkart access token', response.status, body);
  }

  let parsed: { access_token?: string; expires_in?: number };
  try {
    parsed = JSON.parse(body) as { access_token?: string; expires_in?: number };
  } catch {
    throw new FlipkartApiError('Invalid token response from Flipkart', response.status, body);
  }

  const accessToken = parsed.access_token?.trim();
  if (!accessToken) {
    throw new FlipkartApiError('Flipkart token response missing access_token', response.status, body);
  }

  const expiresInSec =
    typeof parsed.expires_in === 'number' && parsed.expires_in > 0 ? parsed.expires_in : 3600;
  cachedToken = {
    accessToken,
    expiresAtMs: now + expiresInSec * 1000,
  };

  return accessToken;
}

/** Used when a call returns 401 so the next request fetches a fresh token. */
export function invalidateFlipkartAccessToken() {
  clearTokenCache();
}
