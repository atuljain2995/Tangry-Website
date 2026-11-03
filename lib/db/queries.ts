// Server-side database queries for products
import { and, asc, count, desc, eq, gte, ilike, inArray, lt, ne, sql } from 'drizzle-orm';
import { getDb, schema } from './index';
import type { CartItem, Review } from '../types/database';
import { ProductExtended } from '../types/database';

const {
  products: productsT,
  productVariants,
  productImages,
  productCategories,
  coupons,
  orders,
  users,
  addresses,
  reviews,
  contactInquiries,
  cwvReadings,
} = schema;

const PLACEHOLDER_IMAGE = '/products/placeholder.png';

function shouldFailBuildOnDbError(): boolean {
  return process.env.FAIL_BUILD_ON_DB_ERROR === 'true';
}

/** Attach variants + images (ordered by display_order) to product rows. */
async function withChildren(rows: DbProduct[]): Promise<DbProduct[]> {
  if (rows.length === 0) return [];
  const db = getDb();
  const ids = rows.map((p) => p.id);
  const [variants, images] = await Promise.all([
    db.select().from(productVariants).where(inArray(productVariants.product_id, ids)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.product_id, ids))
      .orderBy(asc(productImages.display_order)),
  ]);
  return rows.map((product) => ({
    ...product,
    variants: (variants as unknown as DbVariant[]).filter((v) => v.product_id === product.id),
    images: (images as unknown as DbImage[]).filter((img) => img.product_id === product.id),
  }));
}

async function loadProducts(
  label: string,
  query: () => Promise<unknown[]>,
): Promise<ProductExtended[]> {
  try {
    const rows = (await query()) as DbProduct[];
    return transformProducts(await withChildren(rows));
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    return [];
  }
}

/** Row from `product_categories` (public read) */
export type DbProductCategory = {
  id: string;
  slug: string;
  title: string;
  chip_label: string | null;
  description: string | null;
  sort_order: number;
};

/**
 * Canonical product categories for filters, admin selects, sitemap.
 */
export async function getProductCategories(): Promise<DbProductCategory[]> {
  try {
    return await getDb()
      .select({
        id: productCategories.id,
        slug: productCategories.slug,
        title: productCategories.title,
        chip_label: productCategories.chip_label,
        description: productCategories.description,
        sort_order: productCategories.sort_order,
      })
      .from(productCategories)
      .orderBy(asc(productCategories.sort_order), asc(productCategories.title));
  } catch (error) {
    console.error('Error fetching product categories:', error);
    if (shouldFailBuildOnDbError()) {
      throw new Error(`Failed to fetch product categories: ${(error as Error).message}`);
    }
    return [];
  }
}

/**
 * Fetch all active products from database
 */
export async function getAllProducts(): Promise<ProductExtended[]> {
  try {
    const rows = await getDb().select().from(productsT).orderBy(desc(productsT.created_at));
    return transformProducts(await withChildren(rows as unknown as DbProduct[]));
  } catch (error) {
    console.error('Error fetching products:', error);
    if (shouldFailBuildOnDbError()) {
      throw new Error(`Failed to fetch products: ${(error as Error).message}`);
    }
    // Degrade gracefully when the database is temporarily unavailable.
    return [];
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductExtended | null> {
  let rows: unknown[];
  try {
    rows = await getDb().select().from(productsT).where(eq(productsT.slug, slug)).limit(1);
  } catch (error) {
    // Transient DB error — throw so ISR keeps the stale cached page
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${(error as Error).message}`);
  }
  if (rows.length === 0) return null;

  // Use product_images only; ignore products.images column so admin uploads are reflected
  const [enriched] = await withChildren(rows as DbProduct[]);
  return transformProduct(enriched);
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductExtended[]> {
  return loadProducts('products by category', () =>
    getDb()
      .select()
      .from(productsT)
      .where(eq(productsT.category, category))
      .orderBy(desc(productsT.created_at)),
  );
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductExtended[]> {
  return loadProducts('featured products', () =>
    getDb()
      .select()
      .from(productsT)
      .where(eq(productsT.is_featured, true))
      .orderBy(desc(productsT.created_at))
      .limit(limit),
  );
}

/**
 * Fetch related products (same category, different product)
 */
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit: number = 4,
): Promise<ProductExtended[]> {
  return loadProducts('related products', () =>
    getDb()
      .select()
      .from(productsT)
      .where(and(eq(productsT.category, category), ne(productsT.id, excludeId)))
      .orderBy(desc(productsT.rating))
      .limit(limit),
  );
}

/**
 * Fetch products by an array of IDs (e.g. for wishlists)
 */
export async function getProductsByIds(ids: string[]): Promise<ProductExtended[]> {
  if (ids.length === 0) return [];
  return loadProducts('products by IDs', () =>
    getDb().select().from(productsT).where(inArray(productsT.id, ids)),
  );
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
  first_order_only?: boolean | null;
}

/**
 * Fetch coupon by code (active only)
 */
export async function getCouponByCode(code: string): Promise<DbCoupon | null> {
  try {
    const [row] = await getDb()
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, code.toUpperCase().trim()), eq(coupons.is_active, true)))
      .limit(1);
    return (row as DbCoupon | undefined) ?? null;
  } catch {
    return null;
  }
}

/**
 * Count a user's existing orders that count toward "not a first order".
 * Cancelled orders don't disqualify a customer from a first-order coupon.
 */
export async function countQualifyingUserOrders(userId: string): Promise<number> {
  try {
    const [row] = await getDb()
      .select({ n: count() })
      .from(orders)
      .where(and(eq(orders.user_id, userId), ne(orders.order_status, 'cancelled')));
    return row?.n ?? 0;
  } catch (error) {
    console.error('countQualifyingUserOrders error:', error);
    // Fail closed for first-order coupons: treat as "has orders" so we don't
    // hand a first-order discount to a returning customer on a transient error.
    return 1;
  }
}

/**
 * Validate coupon and return discount amount for a given subtotal.
 * Returns { discount, couponId } or { error }.
 *
 * When `userId` is provided and the coupon is first-order-only, the discount is
 * blocked for customers who already have a non-cancelled order. First-order-only
 * coupons still validate for guests (no userId); the flag is re-checked at order
 * placement once the customer is known.
 */
export async function validateCouponAndGetDiscount(
  code: string,
  subtotal: number,
  userId?: string | null,
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

  if (coupon.first_order_only && userId) {
    const existingOrders = await countQualifyingUserOrders(userId);
    if (existingOrders > 0) {
      return { error: 'This code is valid on your first order only' };
    }
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
  await getDb()
    .update(coupons)
    .set({ usage_count: sql`coalesce(${coupons.usage_count}, 0) + 1` })
    .where(eq(coupons.id, couponId));
}

/**
 * Decrement variant stock (call after order is placed). Returns false if insufficient stock.
 */
export async function decrementVariantStock(variantId: string, quantity: number): Promise<boolean> {
  try {
    const updated = await getDb()
      .update(productVariants)
      .set({ stock: sql`${productVariants.stock} - ${quantity}` })
      .where(and(eq(productVariants.id, variantId), gte(productVariants.stock, quantity)))
      .returning({ id: productVariants.id });
    return updated.length > 0;
  } catch {
    return false;
  }
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

type VRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  is_available: boolean | null;
};

/**
 * Resolve cart lines using live DB prices, stock, and product names. Rejects tampered prices.
 */
export async function resolveOrderLineItems(
  lines: OrderLineInput[],
): Promise<{ ok: true; items: CartItem[] } | { ok: false; error: string }> {
  if (!lines?.length) return { ok: false, error: 'Cart is empty' };

  const merged = mergeOrderLines(lines);
  if ('error' in merged) return { ok: false, error: merged.error };
  const mergedLines = merged;

  const variantIds = [...new Set(mergedLines.map((l) => l.variantId))];
  const db = getDb();
  let variants: VRow[];
  let products: { id: string; name: string }[];
  let images: { product_id: string; url: string }[];
  try {
    variants = await db
      .select({
        id: productVariants.id,
        product_id: productVariants.product_id,
        name: productVariants.name,
        price: productVariants.price,
        stock: productVariants.stock,
        is_available: productVariants.is_available,
      })
      .from(productVariants)
      .where(inArray(productVariants.id, variantIds));
    if (variants.length !== variantIds.length) {
      return { ok: false, error: 'One or more products are unavailable' };
    }

    const productIds = [...new Set(variants.map((v) => v.product_id))];
    [products, images] = await Promise.all([
      db
        .select({ id: productsT.id, name: productsT.name })
        .from(productsT)
        .where(inArray(productsT.id, productIds)),
      db
        .select({ product_id: productImages.product_id, url: productImages.url })
        .from(productImages)
        .where(inArray(productImages.product_id, productIds))
        .orderBy(asc(productImages.display_order)),
    ]);
  } catch (error) {
    console.error('resolveOrderLineItems:', error);
    return { ok: false, error: 'One or more products are unavailable' };
  }
  if (!products.length) {
    return { ok: false, error: 'One or more products are unavailable' };
  }

  const nameByProduct = new Map(products.map((p) => [p.id, p.name]));
  const imageByProduct = new Map<string, string>();
  for (const img of images) {
    if (!imageByProduct.has(img.product_id)) {
      imageByProduct.set(img.product_id, img.url || PLACEHOLDER_IMAGE);
    }
  }

  const variantById = new Map(variants.map((v) => [v.id, v]));

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
  discount_enabled?: boolean;
  rating?: number;
  review_count?: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  is_bundle?: boolean;
  ingredients?: string[] | null;
  shelf_life?: string | null;
  no_preservatives?: boolean;
  is_vegetarian?: boolean;
  storage_instructions?: string | null;
  country_of_origin?: string | null;
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
  display_order?: number;
  is_default?: boolean;
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
  try {
    const db = getDb();
    const [product] = await db.select().from(productsT).where(eq(productsT.id, productId)).limit(1);
    if (!product) return null;

    const [variants, images] = await Promise.all([
      db
        .select()
        .from(productVariants)
        .where(eq(productVariants.product_id, productId))
        .orderBy(asc(productVariants.weight)),
      db
        .select()
        .from(productImages)
        .where(eq(productImages.product_id, productId))
        .orderBy(asc(productImages.display_order)),
    ]);

    return {
      product: product as unknown as DbProduct,
      images: images as unknown as DbImage[],
      variants: variants as unknown as DbVariant[],
    };
  } catch (error) {
    console.error('Error fetching product for admin:', error);
    return null;
  }
}

// Pre-migration-028 fallbacks: remove once 028_product_variant_cleanup.sql has run in production
const BUNDLE_NAME = /\b(pack|hamper|combo|gift)\b/i;
function legacyVariantName(name: string, weightGrams: number, isBundle: boolean): string {
  const fmt = (g: number) => (g >= 1000 ? `${g / 1000} kg` : `${g} g`);
  const m = name.match(/^\s*(\d+(?:\.\d+)?)\s*(g|gm|gms|gram|grams|kg|kgs)?\.?\s*$/i);
  if (m) return fmt(Number(m[1]) * (m[2] && /^kg/i.test(m[2]) ? 1000 : 1));
  if (/^\s*default\s*$/i.test(name) && !isBundle && weightGrams > 0) return fmt(weightGrams);
  return name;
}

/**
 * Transform database product to ProductExtended type
 */
function transformProduct(dbProduct: DbProduct): ProductExtended {
  const migrated = dbProduct.is_bundle !== undefined;
  const isBundle = migrated ? !!dbProduct.is_bundle : BUNDLE_NAME.test(dbProduct.name);
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    categoryId: dbProduct.category_id ?? null,
    category: dbProduct.category || '',
    variants:
      [...(dbProduct.variants ?? [])]
        .sort((a, b) =>
          migrated
            ? (a.display_order ?? 0) - (b.display_order ?? 0)
            : (a.weight || 0) - (b.weight || 0),
        )
        .map((v, i) => ({
          id: v.id,
          name: migrated ? v.name : legacyVariantName(v.name, v.weight, isBundle),
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compare_at_price,
          stock: v.stock,
          weight: v.weight,
          isAvailable: v.is_available,
          isDefault: migrated ? (v.is_default ?? false) : i === 0,
        })),
    isBundle,
    ingredients: dbProduct.ingredients ?? undefined,
    shelfLife: dbProduct.shelf_life ?? undefined,
    noPreservatives: dbProduct.no_preservatives ?? true,
    isVegetarian: dbProduct.is_vegetarian ?? true,
    storageInstructions: dbProduct.storage_instructions ?? undefined,
    countryOfOrigin: dbProduct.country_of_origin ?? 'India',
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
    discountEnabled: dbProduct.discount_enabled ?? false,
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
 */
export async function searchProducts(query: string): Promise<ProductExtended[]> {
  const raw = query.trim().slice(0, 120);
  if (!raw) return [];

  // Strip ILIKE wildcards from user input so the pattern stays predictable and safe
  const literal = raw.replace(/[%_\\]/g, '').trim();
  if (!literal) return [];

  const pattern = `%${literal}%`;

  return loadProducts('product search', async () => {
    const db = getDb();
    const [byName, byDesc] = await Promise.all([
      db.select().from(productsT).where(ilike(productsT.name, pattern)).limit(20),
      db.select().from(productsT).where(ilike(productsT.description, pattern)).limit(20),
    ]);
    const byId = new Map([...byName, ...byDesc].map((row) => [row.id, row]));
    return [...byId.values()].slice(0, 20);
  });
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
  try {
    return (await getDb()
      .select({
        id: orders.id,
        order_number: orders.order_number,
        user_email: orders.user_email,
        total: orders.total,
        order_status: orders.order_status,
        payment_status: orders.payment_status,
        created_at: orders.created_at,
      })
      .from(orders)
      .orderBy(desc(orders.created_at))
      .limit(limit)) as AdminOrderRow[];
  } catch (error) {
    console.error('Error fetching orders for admin:', error);
    return [];
  }
}

/**
 * Count products for admin dashboard
 */
export async function getProductsCount(): Promise<number> {
  try {
    const [row] = await getDb().select({ n: count() }).from(productsT);
    return row?.n ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Count product variants with stock below threshold (default 10)
 */
export async function getLowStockVariantsCount(threshold = 10): Promise<number> {
  try {
    const [row] = await getDb()
      .select({ n: count() })
      .from(productVariants)
      .where(and(lt(productVariants.stock, threshold), eq(productVariants.is_available, true)));
    return row?.n ?? 0;
  } catch {
    return 0;
  }
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

  let rows: { total: number; order_status: string | null }[];
  try {
    rows = await getDb()
      .select({ total: orders.total, order_status: orders.order_status })
      .from(orders)
      .where(gte(orders.created_at, iso));
  } catch {
    return 0;
  }
  const total = rows
    .filter((o) => o.order_status !== 'cancelled' && o.order_status !== 'refunded')
    .reduce((sum, o) => sum + Number(o.total), 0);
  return total;
}

/** Default cap for admin list pages. Pages surface a notice when a result hits this. */
export const ADMIN_LIST_LIMIT = 200;

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};

export async function getUsersForAdmin(limit = ADMIN_LIST_LIMIT): Promise<AdminUserRow[]> {
  try {
    return (await getDb()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(desc(users.created_at))
      .limit(limit)) as AdminUserRow[];
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return [];
  }
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

const adminCouponColumns = {
  id: coupons.id,
  code: coupons.code,
  description: coupons.description,
  discount_type: coupons.discount_type,
  discount_value: coupons.discount_value,
  min_order_value: coupons.min_order_value,
  max_discount: coupons.max_discount,
  usage_limit: coupons.usage_limit,
  usage_count: coupons.usage_count,
  valid_from: coupons.valid_from,
  valid_until: coupons.valid_until,
  is_active: coupons.is_active,
  created_at: coupons.created_at,
};

export async function getCouponsForAdmin(limit = ADMIN_LIST_LIMIT): Promise<AdminCouponRow[]> {
  try {
    return (await getDb()
      .select(adminCouponColumns)
      .from(coupons)
      .orderBy(desc(coupons.created_at))
      .limit(limit)) as AdminCouponRow[];
  } catch (error) {
    console.error('Error fetching coupons for admin:', error);
    return [];
  }
}

export async function getCouponByIdForAdmin(id: string): Promise<AdminCouponRow | null> {
  try {
    const [row] = await getDb()
      .select(adminCouponColumns)
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1);
    return (row as AdminCouponRow | undefined) ?? null;
  } catch {
    return null;
  }
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

export async function getContactInquiriesForAdmin(
  limit = ADMIN_LIST_LIMIT,
): Promise<AdminInquiryRow[]> {
  try {
    return (await getDb()
      .select({
        id: contactInquiries.id,
        name: contactInquiries.name,
        email: contactInquiries.email,
        phone: contactInquiries.phone,
        subject: contactInquiries.subject,
        message: contactInquiries.message,
        created_at: contactInquiries.created_at,
      })
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.created_at))
      .limit(limit)) as AdminInquiryRow[];
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return [];
  }
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

  let rows: OrderReportRow[];
  try {
    rows = (await getDb()
      .select({
        total: orders.total,
        order_status: orders.order_status,
        created_at: orders.created_at,
        items: orders.items,
      })
      .from(orders)
      .where(gte(orders.created_at, sinceIso))) as OrderReportRow[];
  } catch (error) {
    console.error('Error fetching orders for reports:', error);
    return {
      revenue7: 0,
      orderCount7: 0,
      revenue30: 0,
      orderCount30: 0,
      topProducts: [],
    };
  }

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
  limit = 200,
): Promise<AdminLowStockVariantRow[]> {
  try {
    const vrows = await getDb()
      .select({
        id: productVariants.id,
        product_id: productVariants.product_id,
        variant_name: productVariants.name,
        sku: productVariants.sku,
        stock: productVariants.stock,
        product_name: productsT.name,
      })
      .from(productVariants)
      .leftJoin(productsT, eq(productsT.id, productVariants.product_id))
      .where(and(lt(productVariants.stock, threshold), eq(productVariants.is_available, true)))
      .orderBy(asc(productVariants.stock))
      .limit(limit);

    return vrows.map((v) => ({
      ...v,
      product_name: v.product_name ?? 'Unknown product',
      stock: Number(v.stock),
    }));
  } catch (error) {
    console.error('Error fetching low-stock variants:', error);
    return [];
  }
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
  try {
    return (await getDb()
      .select({
        id: addresses.id,
        user_id: addresses.user_id,
        type: addresses.type,
        full_name: addresses.full_name,
        phone: addresses.phone,
        address_line1: addresses.address_line1,
        address_line2: addresses.address_line2,
        city: addresses.city,
        state: addresses.state,
        postal_code: addresses.postal_code,
        country: addresses.country,
        is_default: addresses.is_default,
      })
      .from(addresses)
      .where(eq(addresses.user_id, userId))
      .orderBy(desc(addresses.is_default), desc(addresses.created_at))) as AccountAddressRow[];
  } catch (error) {
    console.error('getAddressesForUser:', error);
    return [];
  }
}

/**
 * Fetch the most recent reviews for a product (max 10).
 * Used to populate Review structured data in product page JSON-LD.
 */
export async function getProductReviews(productId: string, limit = 10): Promise<Review[]> {
  let rows: (typeof reviews.$inferSelect)[];
  try {
    rows = await getDb()
      .select()
      .from(reviews)
      .where(eq(reviews.product_id, productId))
      .orderBy(desc(reviews.created_at))
      .limit(limit);
  } catch (error) {
    console.error('getProductReviews:', error);
    return [];
  }

  return rows.map((r) => ({
    id: r.id,
    productId: r.product_id as string,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isVerifiedPurchase: r.is_verified_purchase ?? false,
    images: r.images,
    helpful: r.helpful ?? 0,
    createdAt: new Date(r.created_at as string),
    updatedAt: new Date(r.updated_at as string),
  }));
}

// ─── CWV / Performance ───────────────────────────────────────────────────────

export type CWVThresholds = {
  good: number;
  poor: number;
};

export const CWV_THRESHOLDS: Record<string, CWVThresholds> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

export type CWVMetricSummary = {
  metricName: string;
  p75: number;
  sampleCount: number;
  goodPct: number;
  needsImprovementPct: number;
  poorPct: number;
  /** Latest reading timestamp */
  lastSeen: Date;
};

export type CWVUrlRow = {
  url: string;
  metrics: CWVMetricSummary[];
};

type CWVRawRow = {
  url: string;
  metric_name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  created_at: string;
};

/**
 * Compute per-URL, per-metric P75 and distribution from first-party RUM data.
 * Returns only URLs that have at least one reading in the last `days` days.
 * P75 is approximated from raw readings (sorted) — no PostgreSQL percentile
 * functions needed.
 */
export async function getCWVSummaryForAdmin(days = 28): Promise<CWVUrlRow[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let rows: CWVRawRow[];
  try {
    rows = (await getDb()
      .select({
        url: cwvReadings.url,
        metric_name: cwvReadings.metric_name,
        value: cwvReadings.value,
        rating: cwvReadings.rating,
        created_at: cwvReadings.created_at,
      })
      .from(cwvReadings)
      .where(gte(cwvReadings.created_at, since))
      .orderBy(
        asc(cwvReadings.url),
        asc(cwvReadings.metric_name),
        asc(cwvReadings.value),
      )) as CWVRawRow[];
  } catch (error) {
    console.error('getCWVSummaryForAdmin:', error);
    return [];
  }

  // Group: url → metric_name → readings[]
  const grouped = new Map<string, Map<string, CWVRawRow[]>>();
  for (const row of rows) {
    if (!grouped.has(row.url)) grouped.set(row.url, new Map());
    const byMetric = grouped.get(row.url)!;
    if (!byMetric.has(row.metric_name)) byMetric.set(row.metric_name, []);
    byMetric.get(row.metric_name)!.push(row);
  }

  const result: CWVUrlRow[] = [];

  for (const [url, byMetric] of grouped) {
    const metrics: CWVMetricSummary[] = [];

    for (const [metricName, readings] of byMetric) {
      // Readings are already sorted by value (ascending) from the query
      const values = readings.map((r) => r.value);
      const n = values.length;
      // P75 index: ceil(0.75 * n) - 1, clamped
      const p75Idx = Math.min(Math.ceil(0.75 * n) - 1, n - 1);
      const p75 = values[p75Idx] ?? 0;

      const goodCount = readings.filter((r) => r.rating === 'good').length;
      const poorCount = readings.filter((r) => r.rating === 'poor').length;
      const niCount = n - goodCount - poorCount;

      const latestCreatedAt = readings.reduce(
        (max, r) => (r.created_at > max ? r.created_at : max),
        readings[0].created_at,
      );

      metrics.push({
        metricName,
        p75,
        sampleCount: n,
        goodPct: Math.round((goodCount / n) * 100),
        needsImprovementPct: Math.round((niCount / n) * 100),
        poorPct: Math.round((poorCount / n) * 100),
        lastSeen: new Date(latestCreatedAt),
      });
    }

    result.push({ url, metrics });
  }

  // Sort URLs: home first, then by path length
  result.sort((a, b) => {
    if (a.url === '/') return -1;
    if (b.url === '/') return 1;
    return a.url.localeCompare(b.url);
  });

  return result;
}
