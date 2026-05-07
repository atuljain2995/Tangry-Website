import { MetadataRoute } from 'next';
import { getAllProducts, getProductCategories } from '@/lib/db/queries';
import { blogPosts } from '@/lib/data/blog';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tangryspices.com';

  // Build time — only changes on deploy, not per request
  const buildTime = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: buildTime,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: buildTime,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/founder`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: buildTime,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: buildTime,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: buildTime,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const [allProducts, categories] = await Promise.all([getAllProducts(), getProductCategories()]);

  // Product pages - now includes all 16+ products from database
  const productPages = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || buildTime,
    changeFrequency: 'weekly' as const,
    priority: product.isBestSeller || product.isFeatured ? 0.9 : 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: buildTime,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
