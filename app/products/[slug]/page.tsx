import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  getBreadcrumbSchema,
  getProductSchema,
  getFAQSchema,
  getProductFAQs,
} from '@/lib/utils/schema';
import { ProductPageClient } from './ProductPageClient';
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProducts,
  getProductReviews,
  getProductCategories,
} from '@/lib/db/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = false;

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
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    keywords: product.keywords,
    alternates: { canonical: `/products/${resolvedParams.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://www.tangryspices.com/products/${resolvedParams.slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current), reviews, and category map in parallel
  const [relatedProducts, reviews, categories] = await Promise.all([
    getRelatedProducts(product.category, product.id, 4),
    getProductReviews(product.id),
    getProductCategories(),
  ]);

  const matchedCategory = categories.find((category) => {
    if (product.categoryId) return category.id === product.categoryId;
    return category.title === product.category;
  });
  const categoryUrl = matchedCategory
    ? `https://www.tangryspices.com/categories/${matchedCategory.slug}`
    : 'https://www.tangryspices.com/products';

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.tangryspices.com' },
    { name: 'Products', url: 'https://www.tangryspices.com/products' },
    { name: product.category, url: categoryUrl },
    {
      name: product.name,
      url: `https://www.tangryspices.com/products/${product.slug}`,
    },
  ];

  const productFAQs = getProductFAQs(product);

  return (
    <>
      <StructuredData
        data={[
          getProductSchema(product, reviews),
          getBreadcrumbSchema(breadcrumbs),
          getFAQSchema(productFAQs),
        ]}
      />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
