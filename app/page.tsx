import { HomeClient } from './HomeClient';
import { getAllProducts } from '@/lib/db/queries';
import { resolveMarketplaceLinks } from '@/lib/data/marketplaces';

export const revalidate = false;

export default async function Home() {
  const products = await getAllProducts();
  const marketplaceLinks = resolveMarketplaceLinks();

  return <HomeClient products={products} marketplaceLinks={marketplaceLinks} />;
}
