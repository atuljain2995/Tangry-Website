import type { Where } from 'payload';
import { getPayloadClient } from './client';

export type CMSBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  seoDescription?: string;
  heroImage?: { url: string; alt: string; sizes?: Record<string, { url: string }> };
  body: unknown; // Lexical rich text JSON
  author?: { name: string; role?: string };
  category: string;
  tags?: { tag: string }[];
  productLinks?: { label: string; href: string }[];
  faqs?: { question: string; answer: string }[];
  publishedAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export async function getBlogPosts(options?: { limit?: number; category?: string }) {
  const payload = await getPayloadClient();
  const where: Where = { status: { equals: 'published' } };
  if (options?.category) where.category = { equals: options.category };

  const result = await payload.find({
    collection: 'blog-posts',
    where,
    sort: '-publishedAt',
    limit: options?.limit || 50,
    depth: 1,
  });

  return result.docs as unknown as CMSBlogPost[];
}

export async function getBlogPost(slug: string): Promise<CMSBlogPost | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  });
  return (result.docs[0] as unknown as CMSBlogPost) || null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'blog-posts',
    where: { status: { equals: 'published' } },
    limit: 200,
    depth: 0,
  });
  return result.docs.map((d) => (d as unknown as { slug: string }).slug);
}
