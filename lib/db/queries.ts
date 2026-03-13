// Server-side database queries for products
import { supabase, supabaseAdmin, isSupabaseUnreachable } from './supabase';
import { ProductExtended } from '../types/database';

const PLACEHOLDER_IMAGE = '/products/placeholder.png';

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
    return [];
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
    // PGRST116 = no rows (product not found); avoid logging as error
    if (productError && productError.code !== 'PGRST116') {
      console.error('Error fetching product:', productError);
    }
    return null;
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

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string | null;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
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
    category: dbProduct.category,
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
    rating: dbProduct.rating || 4.5,
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
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<ProductExtended[]> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20);

  if (productsError || !products || products.length === 0) {
    isSupabaseUnreachable(productsError);
    console.error('Error searching products:', productsError);
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

