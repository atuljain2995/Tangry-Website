import { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { StructuredData } from '@/components/seo/StructuredData';
import { getProductSchema } from '@/lib/utils/schema';
import { getAllProducts, getProductCategories } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Shop Masalas, Powders & Pickles',
  description:
    'Browse Tangry’s Jaipur-made masalas (dabeli, pav bhaji), ready-to-eat powders (gun powder, vada pav chutney), essentials, and pickles — FSSAI & ISO 22000.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Shop Tangry Spices — Masalas, Powders & Pickles',
    description:
      'Authentic Rajasthani masalas and spices from Jaipur. FSSAI licensed, ISO 22000 certified.',
    url: 'https://www.tangryspices.com/products',
    type: 'website',
  },
};

export const revalidate = false;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getProductCategories()]);

  return (
    <>
      <StructuredData data={products.map((product) => getProductSchema(product))} />
      <ProductsPageClient products={products} categories={categories} />
    </>
  );
}
