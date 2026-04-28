import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/seo/StructuredData';
import { CategoryPageClient } from './CategoryPageClient';
import { getProductSchema } from '@/lib/utils/schema';
import { getAllProducts, getProductCategories } from '@/lib/db/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = false;

export async function generateStaticParams() {
  const categories = await getProductCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getProductCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const description = category.description || `Browse ${category.title} from Tangry Spices.`;

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
  const [categories, products] = await Promise.all([getProductCategories(), getAllProducts()]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

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
          description: category.description || `Browse ${category.title} from Tangry Spices.`,
          chipLabel: category.chip_label,
        }}
        products={filteredProducts}
      />
    </>
  );
}
