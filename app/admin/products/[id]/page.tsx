import { notFound } from 'next/navigation';
import { getProductByIdForAdmin } from '@/lib/db/queries';
import { AdminProductEditForm } from './AdminProductEditForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const data = await getProductByIdForAdmin(id);
  if (!data) notFound();
  return <AdminProductEditForm data={data} />;
}
