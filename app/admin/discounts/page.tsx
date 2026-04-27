import { AdminLink } from '@/components/admin/AdminLink';
import { Plus } from 'lucide-react';
import { getCouponsForAdmin } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminDiscountsPage() {
  const coupons = await getCouponsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="mt-1 text-sm text-gray-500">Coupon codes for your store</p>
        </div>
        <AdminLink
          href="/admin/discounts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          Add discount
        </AdminLink>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {coupons.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No coupons yet. Create one to offer discounts at checkout.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '640px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Usage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Valid until
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-gray-900 sm:px-6">
                      {c.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                      {c.discount_type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_value}%`
                        : `₹${c.discount_value}`}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                      {c.usage_count}
                      {c.usage_limit != null ? ` / ${c.usage_limit}` : ''}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                      {formatDate(c.valid_until)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm sm:px-6">
                      <AdminLink
                        href={`/admin/discounts/${c.id}`}
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </AdminLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
