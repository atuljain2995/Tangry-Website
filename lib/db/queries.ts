// Server-side database queries for products
import { supabase, supabaseAdmin, isSupabaseUnreachable } from './supabase';
import type { CartItem, Review } from '../types/database';
import { ProductExtended } from '../types/database';

const PLACEHOLDER_IMAGE = '/products/placeholder.png';

/** Row from `product_categories` (public read) */
export type DbProductCategory = {
  id: string;
  slug: string;
  title: string;
  chip_label: string | null;
  sort_order: number;
};

/**
 * Canonical product categories for filters, admin selects, sitemap.
 */
export async function getProductCategories(): Promise<DbProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, slug, title, chip_label, sort_order')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    isSupabaseUnreachable(error);
    console.error('Error fetching product categories:', error);
    return [];
  }
  return (data as DbProductCategory[]) ?? [];
}

/**
 * Fetch all active products from database
 */
export async function getAllProducts(): Promise<ProductExtended[]> {
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (productsError) {
    isSupabaseUnreachable(productsError);
    console.error('Error fetching products:', productsError);
    // Throw so generateStaticParams / ISR keeps stale cache instead of wiping pages
    throw new Error(`Failed to fetch products: ${productsError.message}`);
  }

  if (!products || products.length === 0) return [];

  // Type assertion for products
  const typedProducts = products as unknown as DbProduct[];

  // Fetch all variants for these products
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  // Fetch all images for these products (ordered by display_order)
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds)
    .order('display_order', { ascending: true });

  // Combine the data
  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductExtended | null> {
  // Fetch product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (productError || !product) {
    isSupabaseUnreachable(productError);
    // PGRST116 = no rows (product genuinely not found)
    if (!productError || productError.code === 'PGRST116') {
      return null;
    }
    // Transient DB error — throw so ISR keeps the stale cached page
    console.error('Error fetching product:', productError);
    throw new Error(`Failed to fetch product: ${productError.message}`);
  }

  // Type assertion for product
  const typedProduct = product as unknown as DbProduct;

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', typedProduct.id);

  // Fetch images (ordered by display_order so first image is correct)
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', typedProduct.id)
    .order('display_order', { ascending: true });

  // Use product_images only; ignore products.images column so admin uploads are reflected
  const enrichedProduct: DbProduct = {
    ...typedProduct,
    variants: (variants as unknown as DbVariant[]) || [],
    images: (images as unknown as DbImage[]) || [],
  };

  return transformProduct(enrichedProduct);
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductExtended[]> {
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false});

  if (productsError || !products || products.length === 0) {
    isSupabaseUnreachable(productsError);
    console.error('Error fetching products by category:', productsError);
    return [];
  }

  const typedProducts = products as unknown as DbProduct[];
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductExtended[]> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (productsError || !products || products.length === 0) {
    isSupabaseUnreachable(productsError);
    console.error('Error fetching featured products:', productsError);
    return [];
  }

  const typedProducts = products as unknown as DbProduct[];
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

/**
 * Fetch related products (same category, different product)
 */
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit: number = 4
): Promise<ProductExtended[]> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .order('rating', { ascending: false })
    .limit(limit);

  if (productsError || !products || products.length === 0) {
    isSupabaseUnreachable(productsError);
    console.error('Error fetching related products:', productsError);
    return [];
  }

  const typedProducts = products as unknown as DbProduct[];
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

/**
 * Fetch products by an array of IDs (e.g. for wishlists)
 */
export async function getProductsByIds(ids: string[]): Promise<ProductExtended[]> {
  if (ids.length === 0) return [];

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);

  if (productsError || !products || products.length === 0) {
    isSupabaseUnreachable(productsError);
    console.error('Error fetching products by IDs:', productsError);
    return [];
  }

  const typedProducts = products as unknown as DbProduct[];
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

/** Coupon row from DB (snake_case) */
interface DbCoupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

/**
 * Fetch coupon by code (active only)
 */
export async function getCouponByCode(code: string): Promise<DbCoupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as unknown as DbCoupon;
}

/**
 * Validate coupon and return discount amount for a given subtotal.
 * Returns { discount, couponId } or { error }.
 */
export async function validateCouponAndGetDiscount(
  code: string,
  subtotal: number
): Promise<{ discount: number; couponId: string } | { error: string }> {
  const coupon = await getCouponByCode(code);
  if (!coupon) return { error: 'Invalid or expired coupon' };

  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validUntil = new Date(coupon.valid_until);
  if (now < validFrom) return { error: 'Coupon not yet valid' };
  if (now > validUntil) return { error: 'Coupon has expired' };

  if (coupon.usage_limit != null && coupon.usage_count >= coupon.usage_limit) {
    return { error: 'Coupon usage limit reached' };
  }

  const minOrder = coupon.min_order_value ?? 0;
  if (subtotal < minOrder) {
    return { error: `Minimum order value for this coupon is ₹${minOrder}` };
  }

  let discount: number;
  if (coupon.discount_type === 'percentage') {
    discount = (subtotal * Number(coupon.discount_value)) / 100;
    if (coupon.max_discount != null && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = Number(coupon.discount_value);
  }

  if (discount <= 0) return { error: 'Invalid coupon' };
  return { discount, couponId: coupon.id };
}

/**
 * Increment coupon usage_count (call after order is placed).
 */
export async function incrementCouponUsage(couponId: string): Promise<void> {
  const { data: row } = await supabaseAdmin.from('coupons').select('usage_count').eq('id', couponId).single();
  const current = (row as { usage_count: number } | null)?.usage_count ?? 0;
  await (supabaseAdmin as { from: (table: string) => ReturnType<typeof supabaseAdmin.from> })
    .from('coupons').update({ usage_count: current + 1 } as Record<string, unknown>).eq('id', couponId);
}

/**
 * Decrement variant stock (call after order is placed). Returns false if insufficient stock.
 */
export async function decrementVariantStock(variantId: string, quantity: number): Promise<boolean> {
  const pv = (supabaseAdmin as { from: (table: string) => ReturnType<typeof supabaseAdmin.from> }).from('product_variants');
  const { data: variant, error: fetchErr } = await pv.select('stock').eq('id', variantId).single();

  if (fetchErr || !variant) return false;
  const current = (variant as { stock: number }).stock;
  if (current < quantity) return false;

  const { error: updateErr } = await pv.update({ stock: current - quantity } as Record<string, unknown>).eq('id', variantId);
  return !updateErr;
}

/** Cart lines from the client — only ids/qty are trusted; prices come from DB. */
export type OrderLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

const MAX_LINE_QTY = 500;

function mergeOrderLines(lines: OrderLineInput[]): OrderLineInput[] | { error: string } {
  const map = new Map<string, OrderLineInput>();
  for (const line of lines) {
    if (!line.variantId || !line.productId) return { error: 'Invalid cart line' };
    const q = Math.floor(Number(line.quantity));
    if (!Number.isFinite(q) || q < 1) return { error: 'Invalid quantity' };
    if (q > MAX_LINE_QTY) return { error: 'Quantity too large' };
    const key = line.variantId;
    const existing = map.get(key);
    if (existing) {
      if (existing.productId !== line.productId) return { error: 'Invalid cart' };
      existing.quantity += q;
      if (existing.quantity > MAX_LINE_QTY) return { error: 'Quantity too large' };
    } else {
      map.set(key, { productId: line.productId, variantId: line.variantId, quantity: q });
    }
  }
  return Array.from(map.values());
}

/**
 * Resolve cart lines using live DB prices, stock, and product names. Rejects tampered prices.
 */
export async function resolveOrderLineItems(
  lines: OrderLineInput[]
): Promise<{ ok: true; items: CartItem[] } | { ok: false; error: string }> {
  if (!lines?.length) return { ok: false, error: 'Cart is empty' };

  const merged = mergeOrderLines(lines);
  if ('error' in merged) return { ok: false, error: merged.error };
  const mergedLines = merged;

  const variantIds = [...new Set(mergedLines.map((l) => l.variantId))];
  const { data: variants, error: vErr } = await supabaseAdmin
    .from('product_variants')
    .select('id, product_id, name, price, stock, is_available')
    .in('id', variantIds);

  if (vErr || !variants?.length) {
    isSupabaseUnreachable(vErr);
    return { ok: false, error: 'One or more products are unavailable' };
  }

  if (variants.length !== variantIds.length) {
    return { ok: false, error: 'One or more products are unavailable' };
  }

  const productIds = [...new Set(variants.map((v: { product_id: string }) => v.product_id))];
  const { data: products, error: pErr } = await supabaseAdmin.from('products').select('id, name').in('id', productIds);
  if (pErr || !products?.length) {
    return { ok: false, error: 'One or more products are unavailable' };
  }

  const { data: images } = await supabaseAdmin
    .from('product_images')
    .select('product_id, url, display_order')
    .in('product_id', productIds)
    .order('display_order', { ascending: true });

  const nameByProduct = new Map((products as { id: string; name: string }[]).map((p) => [p.id, p.name]));
  const imageByProduct = new Map<string, string>();
  for (const img of (images as { product_id: string; url: string }[]) ?? []) {
    if (!imageByProduct.has(img.product_id)) {
      imageByProduct.set(img.product_id, img.url || PLACEHOLDER_IMAGE);
    }
  }

  type VRow = {
    id: string;
    product_id: string;
    name: string;
    price: number | string;
    stock: number;
    is_available: boolean;
  };
  const variantById = new Map((variants as VRow[]).map((v) => [v.id, v]));

  const items: CartItem[] = [];
  for (const line of mergedLines) {
    const v = variantById.get(line.variantId);
    if (!v) return { ok: false, error: 'One or more products are unavailable' };
    if (v.product_id !== line.productId) {
      return { ok: false, error: 'Invalid product selection' };
    }
    if (!v.is_available) {
      return { ok: false, error: 'One or more items are not available for sale' };
    }
    if (v.stock < line.quantity) {
      return { ok: false, error: 'Insufficient stock for one or more items' };
    }
    const price = Number(v.price);
    if (!Number.isFinite(price) || price < 0) {
      return { ok: false, error: 'Invalid product price' };
    }

    items.push({
      productId: v.product_id,
      variantId: v.id,
      productName: nameByProduct.get(v.product_id) ?? 'Product',
      variantName: v.name,
      quantity: line.quantity,
      price,
      image: imageByProduct.get(v.product_id) || PLACEHOLDER_IMAGE,
    });
  }

  return { ok: true, items };
}

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  category_id?: string | null;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_hero_product?: boolean;
  rating?: number;
  review_count?: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  created_at: string;
  updated_at: string;
  variants?: DbVariant[];
  images?: DbImage[];
}

interface DbVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  weight: number;
  is_available: boolean;
}

interface DbImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  display_order?: number | null;
}

/** Product + images (with ids) + variants for admin edit */
export interface ProductForAdmin {
  /** Raw row; includes `category_id` when migration 009 is applied */
  product: DbProduct;
  images: DbImage[];
  variants: DbVariant[];
}

/**
 * Fetch a single product by id for admin edit (includes image ids)
 */
export async function getProductByIdForAdmin(productId: string): Promise<ProductForAdmin | null> {
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    isSupabaseUnreachable(productError);
    if (productError && productError.code !== 'PGRST116') {
      console.error('Error fetching product for admin:', productError);
    }
    return null;
  }

  const typedProduct = product as unknown as DbProduct;

  const { data: variants } = await supabaseAdmin
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('weight', { ascending: true });

  const { data: images } = await supabaseAdmin
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true });

  return {
    product: typedProduct,
    images: (images as unknown as DbImage[]) || [],
    variants: (variants as unknown as DbVariant[]) || [],
  };
}

/**
 * Transform database product to ProductExtended type
 */
function transformProduct(dbProduct: DbProduct): ProductExtended {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    categoryId: dbProduct.category_id ?? null,
    category: dbProduct.category || '',
    variants: dbProduct.variants?.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      stock: v.stock,
      weight: v.weight,
      isAvailable: v.is_available,
    })) || [],
    images: (dbProduct.images || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((img) => img.url)
      .filter(Boolean) || [PLACEHOLDER_IMAGE],
    features: [],
    tags: dbProduct.tags || [],
    metaTitle: dbProduct.meta_title || `${dbProduct.name} | Tangry Spices`,
    metaDescription: dbProduct.meta_description || dbProduct.description,
    keywords: dbProduct.keywords || [],
    isFeatured: dbProduct.is_featured,
    isNew: dbProduct.is_new,
    isBestSeller: dbProduct.is_best_seller,
    isHeroProduct: dbProduct.is_hero_product ?? false,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    minOrderQuantity: dbProduct.min_order_quantity || 1,
    maxOrderQuantity: dbProduct.max_order_quantity || 50,
    createdAt: new Date(dbProduct.created_at),
    updatedAt: new Date(dbProduct.updated_at),
  };
}

/**
 * Transform array of database products
 */
function transformProducts(dbProducts: DbProduct[]): ProductExtended[] {
  return dbProducts.map(transformProduct);
}

/**
 * Search products by name or description (case-insensitive).
 * Uses separate ilike filters and merges — avoids PostgREST `.or()` parsing issues with `%` in patterns.
 */
export async function searchProducts(query: string): Promise<ProductExtended[]> {
  const raw = query.trim().slice(0, 120);
  if (!raw) return [];

  // Strip ILIKE wildcards from user input so the pattern stays predictable and safe
  const literal = raw.replace(/[%_\\]/g, '').trim();
  if (!literal) return [];

  const pattern = `%${literal}%`;

  const [nameRes, descRes] = await Promise.all([
    supabase.from('products').select('*').ilike('name', pattern).limit(20),
    supabase.from('products').select('*').ilike('description', pattern).limit(20),
  ]);

  if (nameRes.error) {
    isSupabaseUnreachable(nameRes.error);
    console.error('Error searching products (name):', nameRes.error);
  }
  if (descRes.error) {
    isSupabaseUnreachable(descRes.error);
    console.error('Error searching products (description):', descRes.error);
  }

  if (nameRes.error && descRes.error) return [];

  const byId = new Map<string, DbProduct>();
  if (!nameRes.error) {
    for (const row of nameRes.data || []) {
      byId.set((row as unknown as DbProduct).id, row as unknown as DbProduct);
    }
  }
  if (!descRes.error) {
    for (const row of descRes.data || []) {
      byId.set((row as unknown as DbProduct).id, row as unknown as DbProduct);
    }
  }

  const typedProducts = [...byId.values()].slice(0, 20);
  if (typedProducts.length === 0) return [];
  const productIds = typedProducts.map(p => p.id);
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds);

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

  const enrichedProducts: DbProduct[] = typedProducts.map(product => ({
    ...product,
    variants: (variants as unknown as DbVariant[])?.filter(v => v.product_id === product.id) || [],
    images: (images as unknown as DbImage[])?.filter(img => img.product_id === product.id) || [],
  }));

  return transformProducts(enrichedProducts);
}

// ——— Admin dashboard ———

export type AdminOrderRow = {
  id: string;
  order_number: string;
  user_email: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
};

/**
 * Fetch recent orders for admin dashboard (and orders list)
 */
export async function getOrdersForAdmin(limit = 10): Promise<AdminOrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, user_email, total, order_status, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    isSupabaseUnreachable(error);
    console.error('Error fetching orders for admin:', error);
    return [];
  }
  return (data as AdminOrderRow[]) ?? [];
}

/**
 * Count products for admin dashboard
 */
export async function getProductsCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (error) {
    isSupabaseUnreachable(error);
    return 0;
  }
  return count ?? 0;
}

/**
 * Count product variants with stock below threshold (default 10)
 */
export async function getLowStockVariantsCount(threshold = 10): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .select('id')
    .lt('stock', threshold)
    .eq('is_available', true);

  if (error) {
    isSupabaseUnreachable(error);
    return 0;
  }
  return data?.length ?? 0;
}

/**
 * Sum of order totals for today (for dashboard) — excludes cancelled/refunded.
 * Uses UTC midnight so the range is consistent regardless of server timezone and
 * matches how created_at is stored (timestamp with time zone in UTC).
 */
export async function getOrdersTotalToday(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const iso = startOfDay.toISOString();

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('total, order_status')
    .gte('created_at', iso);

  if (error) {
    isSupabaseUnreachable(error);
    return 0;
  }
  const rows = (data as { total: number; order_status: string }[]) ?? [];
  const total = rows
    .filter((o) => o.order_status !== 'cancelled' && o.order_status !== 'refunded')
    .reduce((sum, o) => sum + Number(o.total), 0);
  return total;
}

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};

export async function getUsersForAdmin(): Promise<AdminUserRow[]> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    isSupabaseUnreachable(error);
    console.error('Error fetching users for admin:', error);
    return [];
  }
  return (data as AdminUserRow[]) ?? [];
}

export type AdminCouponRow = {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
};

export async function getCouponsForAdmin(): Promise<AdminCouponRow[]> {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, usage_count, valid_from, valid_until, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    isSupabaseUnreachable(error);
    console.error('Error fetching coupons for admin:', error);
    return [];
  }
  return (data as AdminCouponRow[]) ?? [];
}

export async function getCouponByIdForAdmin(id: string): Promise<AdminCouponRow | null> {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, usage_count, valid_from, valid_until, is_active, created_at')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as unknown as AdminCouponRow;
}

export type AdminInquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

export async function getContactInquiriesForAdmin(): Promise<AdminInquiryRow[]> {
  const { data, error } = await (supabaseAdmin as unknown as { from: (t: string) => ReturnType<typeof supabaseAdmin.from> })
    .from('contact_inquiries')
    .select('id, name, email, phone, subject, message, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    isSupabaseUnreachable(error as { message?: string });
    console.error('Error fetching contact inquiries:', error);
    return [];
  }
  return (data as AdminInquiryRow[]) ?? [];
}

// ——— Admin reports & inventory ———

type OrderItemJson = {
  productName?: string;
  variantName?: string;
  quantity?: number;
  price?: number;
  subtotal?: number;
};

type OrderReportRow = {
  total: number | string;
  order_status: string;
  created_at: string;
  items: OrderItemJson[] | null;
};

function isOrderCountableForReports(status: string): boolean {
  return status !== 'cancelled' && status !== 'refunded';
}

export type AdminReportsSummary = {
  revenue7: number;
  orderCount7: number;
  revenue30: number;
  orderCount30: number;
  topProducts: { label: string; quantitySold: number; revenue: number }[];
};

/**
 * Sales totals for last 7 / 30 days (excludes cancelled & refunded) and top 5 products by quantity in that 30-day window.
 */
export async function getAdminReportsSummary(): Promise<AdminReportsSummary> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  const sinceIso = since.toISOString();

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('total, order_status, created_at, items')
    .gte('created_at', sinceIso);

  if (error) {
    isSupabaseUnreachable(error);
    console.error('Error fetching orders for reports:', error);
    return {
      revenue7: 0,
      orderCount7: 0,
      revenue30: 0,
      orderCount30: 0,
      topProducts: [],
    };
  }

  const rows = (data as OrderReportRow[]) ?? [];
  const sevenMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let revenue7 = 0;
  let orderCount7 = 0;
  let revenue30 = 0;
  let orderCount30 = 0;
  const productAgg = new Map<string, { quantitySold: number; revenue: number }>();

  for (const row of rows) {
    if (!isOrderCountableForReports(row.order_status)) continue;

    const created = new Date(row.created_at).getTime();
    const total = Number(row.total);

    revenue30 += total;
    orderCount30 += 1;

    if (now - created <= sevenMs) {
      revenue7 += total;
      orderCount7 += 1;
    }

    const items = Array.isArray(row.items) ? row.items : [];
    for (const line of items) {
      const name = line.productName?.trim() || 'Product';
      const variant = line.variantName?.trim();
      const label = variant ? `${name} (${variant})` : name;
      const qty = Math.max(0, Number(line.quantity) || 0);
      const rev = Number(line.subtotal ?? (line.price ?? 0) * qty) || 0;
      const prev = productAgg.get(label) ?? { quantitySold: 0, revenue: 0 };
      productAgg.set(label, {
        quantitySold: prev.quantitySold + qty,
        revenue: prev.revenue + rev,
      });
    }
  }

  const topProducts = [...productAgg.entries()]
    .map(([label, v]) => ({ label, quantitySold: v.quantitySold, revenue: v.revenue }))
    .filter((r) => r.quantitySold > 0)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);

  return {
    revenue7,
    orderCount7,
    revenue30,
    orderCount30,
    topProducts,
  };
}

export type AdminLowStockVariantRow = {
  id: string;
  product_id: string;
  product_name: string;
  variant_name: string;
  sku: string | null;
  stock: number;
};

/**
 * Variants with stock below threshold (default 10), available only, for admin inventory view.
 */
export async function getLowStockVariantsForAdmin(
  threshold = 10,
  limit = 200
): Promise<AdminLowStockVariantRow[]> {
  const { data: variants, error: vErr } = await supabaseAdmin
    .from('product_variants')
    .select('id, product_id, name, sku, stock')
    .lt('stock', threshold)
    .eq('is_available', true)
    .order('stock', { ascending: true })
    .limit(limit);

  if (vErr) {
    isSupabaseUnreachable(vErr);
    console.error('Error fetching low-stock variants:', vErr);
    return [];
  }

  const vrows = (variants as { id: string; product_id: string; name: string; sku: string | null; stock: number }[]) ?? [];
  if (vrows.length === 0) return [];

  const productIds = [...new Set(vrows.map((v) => v.product_id))];
  const { data: products, error: pErr } = await supabaseAdmin
    .from('products')
    .select('id, name')
    .in('id', productIds);

  if (pErr) {
    isSupabaseUnreachable(pErr);
    return [];
  }

  const nameById = new Map((products as { id: string; name: string }[]).map((p) => [p.id, p.name]));

  return vrows.map((v) => ({
    id: v.id,
    product_id: v.product_id,
    product_name: nameById.get(v.product_id) ?? 'Unknown product',
    variant_name: v.name,
    sku: v.sku,
    stock: Number(v.stock),
  }));
}

/** Saved addresses for account / checkout (snake_case from DB) */
export type AccountAddressRow = {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export async function getAddressesForUser(userId: string): Promise<AccountAddressRow[]> {
  const { data, error } = await supabaseAdmin
    .from('addresses')
    .select(
      'id, user_id, type, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default'
    )
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    isSupabaseUnreachable(error);
    console.error('getAddressesForUser:', error);
    return [];
  }
  return (data as AccountAddressRow[]) ?? [];
}

/**
 * Fetch the most recent reviews for a product (max 10).
 * Used to populate Review structured data in product page JSON-LD.
 */
export async function getProductReviews(productId: string, limit = 10): Promise<Review[]> {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('id, product_id, user_id, user_name, rating, title, comment, is_verified_purchase, images, helpful, created_at, updated_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    isSupabaseUnreachable(error);
    console.error('getProductReviews:', error);
    return [];
  }

  type DbReviewRow = {
    id: string;
    product_id: string;
    user_id: string | null;
    user_name: string;
    rating: number;
    title: string;
    comment: string;
    is_verified_purchase: boolean;
    images: string[] | null;
    helpful: number;
    created_at: string;
    updated_at: string;
  };

  return ((data ?? []) as unknown as DbReviewRow[]).map((r) => ({
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isVerifiedPurchase: r.is_verified_purchase,
    images: r.images,
    helpful: r.helpful,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  }));
}

