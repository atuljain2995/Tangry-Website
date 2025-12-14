import { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { getAllProducts } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'All Products | Tangry Spices',
  description: 'Explore our complete range of authentic Indian spices, blended masalas, and ready-to-cook products.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsPageClient products={products} />;
}
