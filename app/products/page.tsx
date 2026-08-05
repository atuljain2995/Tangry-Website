import { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { StructuredData } from '@/components/seo/StructuredData';
import { getItemListSchema, getBreadcrumbSchema } from '@/lib/utils/schema';
import { getAllProducts, getProductCategories } from '@/lib/db/queries';

const PRODUCTS_DESCRIPTION =
  'Buy masala online from Tangry Spices, Jaipur. Shop Rajasthani dabeli masala, pav bhaji, gun powder podi, turmeric, pickles & more. FSSAI licensed. Free shipping ₹500+.';

export const metadata: Metadata = {
  title: 'Buy Masala Online — Rajasthani Spices from Jaipur',
  description: PRODUCTS_DESCRIPTION,
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Buy Masala Online — Rajasthani Spices | Tangry Spices',
    description: PRODUCTS_DESCRIPTION,
    url: 'https://www.tangryspices.com/products',
    type: 'website',
  },
};

export const revalidate = false;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getProductCategories()]);

  return (
    <>
      <StructuredData
        data={[
          getBreadcrumbSchema([
            { name: 'Home', url: 'https://www.tangryspices.com' },
            { name: 'Products', url: 'https://www.tangryspices.com/products' },
          ]),
          getItemListSchema(products),
        ]}
      />
      <ProductsPageClient products={products} categories={categories} />
    </>
  );
}
