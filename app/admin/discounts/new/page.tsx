import { AdminLink } from '@/components/admin/AdminLink';
import { AdminCouponForm } from '../AdminCouponForm';

export const dynamic = 'force-dynamic';

export default function AdminNewDiscountPage() {
  return (
    <div className="space-y-6">
      <div>
        <AdminLink href="/admin/discounts" className="text-sm text-gray-600 hover:text-orange-600">
          ← Discounts
        </AdminLink>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Add discount</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new coupon code</p>
      </div>
      <AdminCouponForm mode="new" />
    </div>
  );
}
