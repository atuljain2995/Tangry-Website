import type { FlipkartConfig } from '@/lib/flipkart/config';
import { flipkartRequest } from '@/lib/flipkart/client';
import type { FlipkartShipmentSearchResponse } from '@/lib/flipkart/types';

const PRE_DISPATCH_STATES = ['APPROVED', 'PACKING_IN_PROGRESS', 'PACKED', 'READY_TO_DISPATCH'] as const;

export async function searchFlipkartPreDispatchShipments(
  config: FlipkartConfig,
  pageSize = 20,
): Promise<FlipkartShipmentSearchResponse> {
  return flipkartRequest<FlipkartShipmentSearchResponse>(config, {
    method: 'POST',
    path: '/sellers/v3/shipments/filter/',
    body: {
      filter: {
        type: 'preDispatch',
        states: [...PRE_DISPATCH_STATES],
        hold: false,
        shipmentTypes: ['NORMAL'],
        serviceProfiles: 'NON_FBF',
      },
      pagination: { pageSize: Math.min(20, Math.max(1, pageSize)) },
      sort: { field: 'dispatchByDate', order: 'asc' },
    },
  });
}
