import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { getDb, schema } from '@/lib/db';
import { getProductsByIds } from '@/lib/db/queries';
import { WishlistClient } from './WishlistClient';

async function getWishlistProductIds(userId: string): Promise<string[]> {
  const { wishlists } = schema;
  const [row] = await getDb()
    .select({ product_ids: wishlists.product_ids })
    .from(wishlists)
    .where(eq(wishlists.user_id, userId))
    .limit(1);

  return row?.product_ids ?? [];
}

export default async function WishlistPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const productIds = await getWishlistProductIds(profile.id);
  const products = await getProductsByIds(productIds);

  return <WishlistClient products={products} />;
}
