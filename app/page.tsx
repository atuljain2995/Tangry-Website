import { HomeClient } from './HomeClient';
import { getAllProducts } from '@/lib/db/queries';
import { resolveMarketplaceLinks } from '@/lib/data/marketplaces';

export const revalidate = false;

export const metadata = {
  title: { absolute: 'Tangry Spices – Masalas, Podis & Pickles Made in Jaipur' },
  description:
    'Shop Tangry masalas, podis & pickles made in Jaipur: peri peri, dabeli, pav bhaji, jeeravan & more. FSSAI licensed, ISO 22000. Free delivery above ₹500.',
  alternates: { canonical: '/' },
};

export default async function Home() {
  const products = await getAllProducts();
  const marketplaceLinks = resolveMarketplaceLinks();

  return <HomeClient products={products} marketplaceLinks={marketplaceLinks} />;
}
