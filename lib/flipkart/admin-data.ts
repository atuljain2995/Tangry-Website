import { getFlipkartConfig, isFlipkartConfigured } from '@/lib/flipkart/config';
import { formatFlipkartError } from '@/lib/flipkart/errors';
import { searchFlipkartListings } from '@/lib/flipkart/listings';
import { searchFlipkartPreDispatchShipments } from '@/lib/flipkart/shipments';
import type { FlipkartListingRow, FlipkartShipment } from '@/lib/flipkart/types';

export type FlipkartAdminSnapshot = {
  configured: boolean;
  storefrontUrl: string | null;
  error: string | null;
  listings: {
    total: number;
    rows: FlipkartListingRow[];
  } | null;
  preDispatch: {
    count: number;
    rows: FlipkartShipment[];
    hasMore: boolean;
  } | null;
};

export async function loadFlipkartAdminSnapshot(searchText?: string): Promise<FlipkartAdminSnapshot> {
  const config = getFlipkartConfig();
  if (!config) {
    return {
      configured: false,
      storefrontUrl: null,
      error: null,
      listings: null,
      preDispatch: null,
    };
  }

  try {
    const [listingsRes, shipmentsRes] = await Promise.all([
      searchFlipkartListings(config, { searchText }),
      searchFlipkartPreDispatchShipments(config),
    ]);

    const listingRows = listingsRes.listingData ?? [];
    const shipmentRows = shipmentsRes.shipments ?? [];

    return {
      configured: true,
      storefrontUrl: config.storefrontUrl,
      error: null,
      listings: {
        total: listingsRes.totalListingsCount ?? listingRows.length,
        rows: listingRows,
      },
      preDispatch: {
        count: shipmentRows.length,
        rows: shipmentRows,
        hasMore: Boolean(shipmentsRes.hasMore),
      },
    };
  } catch (err) {
    return {
      configured: isFlipkartConfigured(),
      storefrontUrl: config.storefrontUrl,
      error: formatFlipkartError(err),
      listings: null,
      preDispatch: null,
    };
  }
}
