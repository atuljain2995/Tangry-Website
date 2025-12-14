// Server-side database queries for products
import { supabase } from './supabase';
import { ProductExtended } from '../types/database';

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
    console.error('Error fetching product:', productError);
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
    images: dbProduct.images?.map((img) => img.url) || ['/products/placeholder.jpg'],
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

