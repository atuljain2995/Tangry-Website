import type { FlipkartConfig } from '@/lib/flipkart/config';
import { flipkartRequest } from '@/lib/flipkart/client';
import type {
  FlipkartListingInternalState,
  FlipkartListingsSearchResponse,
} from '@/lib/flipkart/types';

export async function searchFlipkartListings(
  config: FlipkartConfig,
  input: {
    internalState?: FlipkartListingInternalState;
    batchNo?: number;
    searchText?: string;
  } = {},
): Promise<FlipkartListingsSearchResponse> {
  return flipkartRequest<FlipkartListingsSearchResponse>(config, {
    method: 'POST',
    path: '/sellers/listings/v3/product/search',
    body: {
      batchNo: input.batchNo ?? 0,
      internalState: input.internalState ?? 'ACTIVE',
      ...(input.searchText?.trim() ? { searchText: input.searchText.trim() } : {}),
    },
  });
}
