import { CartItem } from '@/lib/types/database';

export interface Ga4Item {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
}

export function ga4ItemId(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}

export function cartItemsToGa4(items: CartItem[]): Ga4Item[] {
  return items.map((item) => ({
    item_id: ga4ItemId(item.productId, item.variantId),
    item_name: item.productName,
    item_variant: item.variantName,
    price: item.price,
    quantity: item.quantity,
  }));
}

export function productToGa4Item(params: {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity?: number;
}): Ga4Item {
  return {
    item_id: ga4ItemId(params.productId, params.variantId),
    item_name: params.productName,
    item_variant: params.variantName,
    price: params.price,
    quantity: params.quantity ?? 1,
  };
}

export function ga4ItemsValue(items: Ga4Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
