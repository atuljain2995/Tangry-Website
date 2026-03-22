import Link from 'next/link';
import { getLowStockVariantsForAdmin } from '@/lib/db/queries';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminTableScroll } from '@/components/admin/AdminTableScroll';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const rows = await getLowStockVariantsForAdmin(10, 200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Variants with stock below 10 (available only). Adjust thresholds in the product editor.
        </p>
      </div>

      <AdminSectionCard title="Low stock" description={`${rows.length} variant(s) below threshold`}>
        <AdminTableScroll>
          {rows.length === 0 ? (
            <AdminEmptyState
              title="No low-stock variants"
              description="All available variants have at least 10 units in stock."
            />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Variant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 sm:px-6">
                      {row.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 sm:px-6">{row.variant_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                      {row.sku ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-amber-800 sm:px-6">
                      {row.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm sm:px-6">
                      <Link
                        href={`/admin/products/${row.product_id}`}
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        Edit product
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminTableScroll>
      </AdminSectionCard>
    </div>
  );
}
