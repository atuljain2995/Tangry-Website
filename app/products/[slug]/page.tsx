import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPageClient } from './ProductPageClient';
import { getProductBySlug, getRelatedProducts, getAllProducts } from '@/lib/db/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Always fetch fresh data so product image updates from admin show immediately
export const dynamic = 'force-dynamic';

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  // Do not pass local image paths to OG (Next.js can validate and throw if file missing/invalid)
  return {
    title: product.metaTitle || `${product.name} | Tangry Spices`,
    description: product.metaDescription || product.description,
    keywords: product.keywords,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current)
  const relatedProducts = await getRelatedProducts(product.category, product.id, 4);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
