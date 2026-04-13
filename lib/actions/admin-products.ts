'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/db/supabase';
import type { Database } from '@/lib/db/database.types';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

type ProductUpdate = {
  name?: string;
  description?: string | null;
  category_id?: string | null;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_hero_product?: boolean;
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
      updated_at: new Date().toISOString(),
    };
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.category_id !== undefined) payload.category_id = data.category_id;
    if (data.meta_title !== undefined) payload.meta_title = data.meta_title;
    if (data.meta_description !== undefined) payload.meta_description = data.meta_description;
    if (data.keywords !== undefined) payload.keywords = data.keywords;
    if (data.is_featured !== undefined) payload.is_featured = data.is_featured;
    if (data.is_new !== undefined) payload.is_new = data.is_new;
    if (data.is_best_seller !== undefined) payload.is_best_seller = data.is_best_seller;
    if (data.is_hero_product !== undefined) payload.is_hero_product = data.is_hero_product;
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
      // Assign display_order from each new image's index in the full images array
      // so ordering matches the submitted order and doesn't collide with existing images.
      const insertPayloads = images
        .map((img, index) => {
          if (img.id || !img.url.trim()) return null;
          return {
            product_id: productId,
            url: img.url.trim(),
            alt_text: img.alt_text ?? null,
            display_order: index,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);
      await db.from('product_images').insert(insertPayloads);
    }

    revalidatePath('/');
    revalidatePath('/products');
    const { data: productRow } = await supabaseAdmin.from('products').select('slug').eq('id', productId).single();
    if (productRow && typeof productRow === 'object' && 'slug' in productRow) {
      revalidatePath(`/products/${(productRow as { slug: string }).slug}`);
    }
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export type CreateProductInput = {
  name: string;
  slug?: string | null;
  description?: string | null;
  category_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_hero_product?: boolean;
  image_url?: string | null;
  variant_name?: string | null;
  variant_sku?: string | null;
  variant_price: number;
  variant_compare_at_price?: number | null;
  variant_stock?: number;
  variant_weight?: number;
};

export async function createProduct(
  input: CreateProductInput
): Promise<{ success: true; productId: string; slug: string } | { success: false; error: string }> {
  try {
    const slug = (input.slug?.trim() || slugify(input.name)).toLowerCase();
    if (!slug) return { success: false, error: 'Slug is required' };

    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (existing) return { success: false, error: 'A product with this slug already exists' };

    const metaTitle = input.meta_title?.trim() || input.name;
    const metaDesc = input.meta_description?.trim() || input.description?.trim() || '';

    const productPayload = {
      slug,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      category_id: input.category_id?.trim() || null,
      images: [],
      variants: {},
      features: [],
      ingredients: [],
      tags: [],
      meta_title: metaTitle,
      meta_description: metaDesc,
      keywords: [],
      is_featured: input.is_featured ?? false,
      is_new: input.is_new ?? false,
      is_best_seller: input.is_best_seller ?? false,
      is_hero_product: input.is_hero_product ?? false,
      rating: 0,
      review_count: 0,
      min_order_quantity: 1,
      max_order_quantity: null,
    };
    const { data: product, error: productError } = await (supabaseAdmin as unknown as {
      from: (t: string) => { insert: (v: unknown) => { select: (c: string) => { single: () => Promise<{ data: unknown; error: unknown }> } } };
    })
      .from('products')
      .insert(productPayload)
      .select('id, slug')
      .single();

    if (productError || !product) {
      console.error('createProduct error:', productError);
      return { success: false, error: (productError as { message?: string })?.message ?? 'Failed to create product' };
    }

    const productId = (product as { id: string }).id;
    const productSlug = (product as { slug: string }).slug;

    const db = supabaseAdmin as unknown as {
      from: (t: string) => {
        insert: (u: object | object[]) => Promise<{ error: unknown }>;
      };
    };

    const imageUrl = input.image_url?.trim() || '/products/placeholder.png';
    await db.from('product_images').insert({
      product_id: productId,
      url: imageUrl,
      alt_text: input.name.trim(),
      display_order: 0,
    });

    const vName = input.variant_name?.trim() || 'Default';
    const vSku = input.variant_sku?.trim() || `${slug}-default`;
    const vPrice = Number(input.variant_price) || 0;
    const vStock = Number(input.variant_stock) ?? 0;
    const vWeight = Number(input.variant_weight) ?? 100;

    const variantPayload = {
      product_id: productId,
      name: vName,
      sku: vSku,
      price: vPrice,
      compare_at_price: input.variant_compare_at_price ?? null,
      stock: vStock,
      weight: vWeight,
      is_available: true,
    };
    const { error: variantError } = await (supabaseAdmin as unknown as { from: (t: string) => { insert: (v: unknown) => Promise<{ error: unknown }> } })
      .from('product_variants')
      .insert(variantPayload);

    if (variantError) {
      console.error('createProduct variant error:', variantError);
      // Product and image already created; admin can add variant from edit page
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    return { success: true, productId, slug: productSlug };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export type VariantInput = {
  id?: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  weight: number;
  is_available: boolean;
};

export async function upsertProductVariants(
  productId: string,
  variants: VariantInput[]
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const vTable = supabaseAdmin.from('product_variants');

    const { data: existingRows } = await vTable.select('id').eq('product_id', productId);
    const existingIds = (existingRows as { id: string }[] | null)?.map((r) => r.id) ?? [];
    const inputIds = variants.filter((v) => v.id).map((v) => v.id as string);
    const toDelete = existingIds.filter((id) => !inputIds.includes(id));

    for (const id of toDelete) {
      await vTable.delete().eq('id', id);
    }

    for (const v of variants) {
      const payload = {
        name: v.name.trim(),
        sku: v.sku.trim(),
        price: Number(v.price) || 0,
        compare_at_price: v.compare_at_price ?? null,
        stock: Number(v.stock) ?? 0,
        weight: Number(v.weight) ?? 100,
        is_available: !!v.is_available,
      };
      if (v.id) {
        const { error } = await vTable.update(payload as never).eq('id', v.id);
        if (error) throw error;
      } else {
        const { error } = await vTable.insert({ product_id: productId, ...payload } as never);
        if (error) throw error;
      }
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    const { data: productRow } = await supabaseAdmin.from('products').select('slug').eq('id', productId).single();
    if (productRow && typeof productRow === 'object' && 'slug' in productRow) {
      revalidatePath(`/products/${(productRow as { slug: string }).slug}`);
    }
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: msg };
  }
}
