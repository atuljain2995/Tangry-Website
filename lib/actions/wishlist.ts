'use server';

import { getCurrentUserProfile } from '@/lib/auth/user';
import { supabaseAdmin } from '@/lib/db/supabase';

type WishlistResult = { success: true; productIds: string[] } | { success: false; error: string };

// The wishlists table isn't in the generated Database type, so we cast to any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wishlists = () => (supabaseAdmin as any).from('wishlists');

export async function getWishlist(): Promise<WishlistResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  const { data, error } = await wishlists()
    .select('product_ids')
    .eq('user_id', profile.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { success: false, error: 'Failed to load wishlist' };
  }

  return { success: true, productIds: data?.product_ids ?? [] };
}

export async function toggleWishlistItem(productId: string): Promise<WishlistResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  // Get current wishlist
  const { data: existing } = await wishlists()
    .select('id, product_ids')
    .eq('user_id', profile.id)
    .single();

  let newProductIds: string[];

  if (existing) {
    const currentIds: string[] = existing.product_ids ?? [];
    if (currentIds.includes(productId)) {
      newProductIds = currentIds.filter((id: string) => id !== productId);
    } else {
      newProductIds = [...currentIds, productId];
    }

    const { error } = await wishlists()
      .update({ product_ids: newProductIds })
      .eq('id', existing.id);

    if (error) return { success: false, error: 'Failed to update wishlist' };
  } else {
    newProductIds = [productId];

    const { error } = await wishlists().insert({ user_id: profile.id, product_ids: newProductIds });

    if (error) return { success: false, error: 'Failed to create wishlist' };
  }

  return { success: true, productIds: newProductIds };
}
