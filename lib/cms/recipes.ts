import type { Where } from 'payload';
import { getPayloadClient } from './client';

export type CMSRecipe = {
  id: string;
  title: string;
  slug: string;
  description: unknown; // Lexical rich text JSON
  seoDescription?: string;
  keywords?: { keyword: string }[];
  heroImage?: { url: string; alt: string; sizes?: Record<string, { url: string }> };
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  cuisine: string;
  featured: boolean;
  ingredients: { item: string }[];
  instructions: { step: number; text: string }[];
  tips?: { tip: string }[];
  productLink?: { label: string; href: string };
  author?: { name: string; role?: string };
  publishedAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export async function getRecipes(options?: { limit?: number; featured?: boolean; category?: string }) {
  const payload = await getPayloadClient();
  const where: Where = { status: { equals: 'published' } };
  if (options?.featured !== undefined) where.featured = { equals: options.featured };
  if (options?.category) where.category = { equals: options.category };

  const result = await payload.find({
    collection: 'recipes',
    where,
    sort: '-publishedAt',
    limit: options?.limit || 50,
    depth: 1,
  });

  return result.docs as unknown as CMSRecipe[];
}

export async function getRecipe(slug: string): Promise<CMSRecipe | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'recipes',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  });
  return (result.docs[0] as unknown as CMSRecipe) || null;
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'recipes',
    where: { status: { equals: 'published' } },
    limit: 200,
    depth: 0,
  });
  return result.docs.map((d) => (d as unknown as { slug: string }).slug);
}
