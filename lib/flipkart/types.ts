export type FlipkartListingInternalState =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'READY_FOR_ACTIVATION'
  | 'ARCHIVED'
  | 'INACTIVATED_BY_FLIPKART';

export type FlipkartProductDescription = {
  ssp?: number;
  esp?: number | null;
  mrp?: number;
  dimensions?: {
    breadth?: number;
    length?: number;
    height?: number;
    weight?: number;
  };
};

export type FlipkartListingRow = {
  listingId?: string;
  sellerId?: string;
  productId?: string;
  sku?: string;
  status?: string;
  product_name?: string;
  product_image_url?: string;
  vertical?: string;
  product_description?: FlipkartProductDescription;
};

export type FlipkartListingsSearchResponse = {
  totalListingsCount?: number;
  listingData?: FlipkartListingRow[];
};

export type FlipkartShipmentSearchResponse = {
  hasMore?: boolean;
  nextPageUrl?: string;
  shipments?: FlipkartShipment[];
};

export type FlipkartShipment = {
  shipmentId?: string;
  orderId?: string;
  orderDate?: string;
  dispatchByDate?: string;
  shipmentStatus?: string;
  hold?: boolean;
  sellerId?: string;
  locationId?: string;
  orderItems?: Array<{
    orderItemId?: string;
    sku?: string;
    title?: string;
    quantity?: number;
    price?: number;
  }>;
};
