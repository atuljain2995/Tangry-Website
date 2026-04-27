import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { supabaseAdmin } from '@/lib/db/supabase';
import { getProductsByIds } from '@/lib/db/queries';
import { WishlistClient } from './WishlistClient';

async function getWishlistProductIds(userId: string): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabaseAdmin as any)
    .from('wishlists')
    .select('product_ids')
    .eq('user_id', userId)
    .single();

  return data?.product_ids ?? [];
}

export default async function WishlistPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const productIds = await getWishlistProductIds(profile.id);
  const products = await getProductsByIds(productIds);

  return <WishlistClient products={products} />;
}
