import type { FlipkartConfig } from '@/lib/flipkart/config';
import { FlipkartApiError } from '@/lib/flipkart/errors';
import { getFlipkartAccessToken, invalidateFlipkartAccessToken } from '@/lib/flipkart/auth';

type FlipkartRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  /** Absolute URL override (e.g. nextPageUrl from shipment search). */
  url?: string;
};

export async function flipkartRequest<T>(
  config: FlipkartConfig,
  options: FlipkartRequestOptions,
): Promise<T> {
  const run = async (retryOn401: boolean): Promise<T> => {
    const token = await getFlipkartAccessToken(config);
    const url =
      options.url ??
      `${config.apiBaseUrl}${options.path.startsWith('/') ? options.path : `/${options.path}`}`;

    const response = await fetch(url, {
      method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });

    const text = await response.text();

    if (response.status === 401 && retryOn401) {
      invalidateFlipkartAccessToken();
      return run(false);
    }

    if (!response.ok) {
      throw new FlipkartApiError(`Flipkart request failed: ${options.path}`, response.status, text);
    }

    if (!text.trim()) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new FlipkartApiError('Invalid JSON from Flipkart', response.status, text);
    }
  };

  return run(true);
}
