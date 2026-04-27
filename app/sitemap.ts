import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/db/queries";
import { PRODUCT_CATEGORIES } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";
import { getProductCategories, type DbProductCategory } from "@/lib/db/queries";

function fallbackCategories(): DbProductCategory[] {
  return PRODUCT_CATEGORIES.map((category, index) => ({
    id: category.id,
    slug: category.id,
    title: category.title,
    chip_label: category.chipLabel ?? null,
    sort_order: index,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tangryspices.com";

  // Build time — only changes on deploy, not per request
  const buildTime = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: buildTime,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: buildTime,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: buildTime,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Fetch all products from database (not fallback) for complete sitemap coverage
  let allProducts = [];
  try {
    allProducts = await getAllProducts();
  } catch {
    console.warn(
      "Failed to fetch products from database for sitemap, using fallback",
    );
    // If DB fails, import fallback
    const { PRODUCTS_EXTENDED } = await import("@/lib/data/productsExtended");
    allProducts = PRODUCTS_EXTENDED;
  }

  // Product pages - now includes all 16+ products from database
  const productPages = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || buildTime,
    changeFrequency: "weekly" as const,
    priority: product.isBestSeller || product.isFeatured ? 0.9 : 0.8,
  }));

  const fromDb = await getProductCategories();
  const categories = fromDb.length > 0 ? fromDb : fallbackCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: buildTime,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
