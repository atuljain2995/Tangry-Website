'use server';

import { supabaseAdmin } from '@/lib/db/supabase';
import type { Database } from '@/lib/db/database.types';

type ProductUpdate = {
  name?: string;
  description?: string | null;
  category?: string | null;
  subcategory?: string | null;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
};

type ImageInput = {
  id?: string;
  url: string;
  alt_text?: string | null;
  display_order?: number;
};

export async function updateProduct(
  productId: string,
  data: ProductUpdate
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const payload: Database['public']['Tables']['products']['Update'] = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin
      .from('products')
      .update(payload as never)
      .eq('id', productId);

    if (error) {
      console.error('Admin updateProduct error:', error);
      return { success: false, error: (error as { message?: string })?.message ?? 'Update failed' };
    }
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function updateProductImages(
  productId: string,
  images: ImageInput[]
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const existingIds = images.filter((img) => img.id).map((img) => img.id as string);
    const toInsert = images.filter((img) => !img.id && img.url.trim() !== '');

    // product_images is not in Database type; use typed client for table access
    const db = supabaseAdmin as unknown as {
      from: (t: string) => {
        select: (c: string) => { eq: (k: string, v: string) => Promise<{ data: unknown }> };
        delete: () => { in: (k: string, v: string[]) => Promise<unknown> };
        update: (u: object) => { eq: (k: string, v: string) => Promise<{ error: unknown }> };
        insert: (u: object | object[]) => Promise<{ error: unknown }>;
      };
    };

    const { data: currentRows } = await db.from('product_images').select('id').eq('product_id', productId);
    const currentIds = (currentRows as { id: string }[] | null)?.map((r) => r.id) ?? [];
    const toDelete = currentIds.filter((id) => !existingIds.includes(id));
    if (toDelete.length > 0) {
      await db.from('product_images').delete().in('id', toDelete);
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.id && img.url.trim() !== '') {
        await db.from('product_images').update({
          url: img.url.trim(),
          alt_text: img.alt_text ?? null,
          display_order: img.display_order ?? i,
        }).eq('id', img.id);
      }
    }

    if (toInsert.length > 0) {
      const startOrder = images.length - toInsert.length;
      await db.from('product_images').insert(
        toInsert.map((img, idx) => ({
          product_id: productId,
          url: img.url.trim(),
          alt_text: img.alt_text ?? null,
          display_order: startOrder + idx,
        }))
      );
    }

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: msg };
  }
}
