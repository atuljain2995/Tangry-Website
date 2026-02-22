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

  // Fetch all images for these products
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds);

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

  // Fetch images
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', typedProduct.id);

  // Combine the data
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
    images: dbProduct.images?.map((img) => img.url) || [PLACEHOLDER_IMAGE],
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

