import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/seo/StructuredData';
import { CategoryPageClient } from './CategoryPageClient';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';
import { getProductSchema } from '@/lib/utils/schema';
import { getAllProducts, getProductCategories, type DbProductCategory } from '@/lib/db/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

function fallbackCategories(): DbProductCategory[] {
  return PRODUCT_CATEGORIES.map((category, index) => ({
    id: category.id,
    slug: category.id,
    title: category.title,
    chip_label: category.chipLabel ?? null,
    sort_order: index,
  }));
}

async function getCategories() {
  const fromDb = await getProductCategories();
  return fromDb.length > 0 ? fromDb : fallbackCategories();
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const fallbackMeta = PRODUCT_CATEGORIES.find((item) => item.id === category.slug || item.title === category.title);
  const description = fallbackMeta?.description || `Browse ${category.title} from Tangry Spices.`;

  return {
    title: category.title,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.title} | Tangry Spices`,
      description,
      url: `https://www.tangryspices.com/categories/${category.slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const fallbackMeta = PRODUCT_CATEGORIES.find((item) => item.id === category.slug || item.title === category.title);
  const filteredProducts = products.filter((product) => {
    if (product.categoryId === category.id) return true;
    return product.category === category.title;
  });

  return (
    <>
      <StructuredData data={filteredProducts.map((product) => getProductSchema(product))} />
      <CategoryPageClient
        category={{
          slug: category.slug,
          title: category.title,
          description: fallbackMeta?.description || `Browse ${category.title} from Tangry Spices.`,
          chipLabel: category.chip_label,
        }}
        products={filteredProducts}
      />
    </>
  );
}