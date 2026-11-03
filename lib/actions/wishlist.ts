'use server';

import { eq } from 'drizzle-orm';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { getDb, schema } from '@/lib/db';

type WishlistResult = { success: true; productIds: string[] } | { success: false; error: string };

const { wishlists } = schema;

async function findWishlist(userId: string) {
  const [row] = await getDb()
    .select({ id: wishlists.id, product_ids: wishlists.product_ids })
    .from(wishlists)
    .where(eq(wishlists.user_id, userId))
    .limit(1);
  return row;
}

export async function getWishlist(): Promise<WishlistResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  try {
    const row = await findWishlist(profile.id);
    return { success: true, productIds: row?.product_ids ?? [] };
  } catch {
    return { success: false, error: 'Failed to load wishlist' };
  }
}

export async function toggleWishlistItem(productId: string): Promise<WishlistResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  const existing = await findWishlist(profile.id);

  let newProductIds: string[];

  if (existing) {
    const currentIds: string[] = existing.product_ids ?? [];
    if (currentIds.includes(productId)) {
      newProductIds = currentIds.filter((id: string) => id !== productId);
    } else {
      newProductIds = [...currentIds, productId];
    }

    try {
      await getDb()
        .update(wishlists)
        .set({ product_ids: newProductIds })
        .where(eq(wishlists.id, existing.id));
    } catch {
      return { success: false, error: 'Failed to update wishlist' };
    }
  } else {
    newProductIds = [productId];

    try {
      await getDb().insert(wishlists).values({ user_id: profile.id, product_ids: newProductIds });
    } catch {
      return { success: false, error: 'Failed to create wishlist' };
    }
  }

  return { success: true, productIds: newProductIds };
}
