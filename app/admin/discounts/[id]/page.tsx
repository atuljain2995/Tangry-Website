import { notFound } from 'next/navigation';
import { AdminLink } from '@/components/admin/AdminLink';
import { getCouponByIdForAdmin } from '@/lib/db/queries';
import { AdminCouponForm } from '../AdminCouponForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditDiscountPage({ params }: Props) {
  const { id } = await params;
  const coupon = await getCouponByIdForAdmin(id);
  if (!coupon) notFound();

  return (
    <div className="space-y-6">
      <div>
        <AdminLink href="/admin/discounts" className="text-sm text-gray-600 hover:text-orange-600">
          ← Discounts
        </AdminLink>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit: {coupon.code}</h1>
      </div>
      <AdminCouponForm mode="edit" coupon={coupon} />
    </div>
  );
}
