import { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { getAllProducts } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Shop Masalas, Powders & Pickles',
  description:
    'Browse Tangry’s Jaipur-made masalas (dabeli, pav bhaji), ready-to-eat powders (gun powder, vada pav chutney), essentials, and pickles — FSSAI & ISO 22000.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsPageClient products={products} />;
}
