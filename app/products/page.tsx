import { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';
import { getAllProducts, getProductCategories, type DbProductCategory } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Shop Masalas, Powders & Pickles',
  description:
    'Browse Tangry’s Jaipur-made masalas (dabeli, pav bhaji), ready-to-eat powders (gun powder, vada pav chutney), essentials, and pickles — FSSAI & ISO 22000.',  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Shop Tangry Spices — Masalas, Powders & Pickles',
    description:
      'Authentic Rajasthani masalas and spices from Jaipur. FSSAI licensed, ISO 22000 certified.',
    url: 'https://www.tangryspices.com/products',
    type: 'website',
  },};

export const revalidate = 3600; // Revalidate every hour

function fallbackCategories(): DbProductCategory[] {
  return PRODUCT_CATEGORIES.map((c, i) => ({
    id: c.id,
    slug: c.id,
    title: c.title,
    chip_label: c.chipLabel ?? null,
    sort_order: i,
  }));
}

export default async function ProductsPage() {
  const [products, fromDb] = await Promise.all([getAllProducts(), getProductCategories()]);
  const categories = fromDb.length > 0 ? fromDb : fallbackCategories();

  return <ProductsPageClient products={products} categories={categories} />;
}
