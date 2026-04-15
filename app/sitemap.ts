import { MetadataRoute } from 'next';
import { PRODUCTS_EXTENDED } from '@/lib/data/productsExtended';

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
  ];

  // Product pages
  const productPages = PRODUCTS_EXTENDED.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: product.isBestSeller || product.isFeatured ? 0.9 : 0.8,
  }));

  return [...staticPages, ...productPages];
}

