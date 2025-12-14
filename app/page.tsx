import { HomeClient } from './HomeClient';
import { getAllProducts } from '@/lib/db/queries';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch all products for homepage
  const products = await getAllProducts();

  return <HomeClient products={products} />;
}
