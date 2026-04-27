import { notFound } from 'next/navigation';
import { getProductByIdForAdmin, getProductCategories } from '@/lib/db/queries';
import { AdminProductEditForm } from './AdminProductEditForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const [data, categories] = await Promise.all([
    getProductByIdForAdmin(id),
    getProductCategories(),
  ]);
  if (!data) notFound();
  return <AdminProductEditForm data={data} categories={categories} />;
}
