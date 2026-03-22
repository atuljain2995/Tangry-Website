import Link from 'next/link';
import { getAdminReportsSummary } from '@/lib/db/queries';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminSummaryCard } from '@/components/admin/AdminSummaryCard';
import { AdminTableScroll } from '@/components/admin/AdminTableScroll';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminReportsPage() {
  const summary = await getAdminReportsSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Revenue excludes cancelled and refunded orders. Top products use line items from the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminSummaryCard label="Revenue (7 days)" value={formatCurrency(summary.revenue7)} />
        <AdminSummaryCard label="Orders (7 days)" value={summary.orderCount7} />
        <AdminSummaryCard label="Revenue (30 days)" value={formatCurrency(summary.revenue30)} />
        <AdminSummaryCard label="Orders (30 days)" value={summary.orderCount30} />
      </div>

      <AdminSectionCard
        title="Top products"
        description="By units sold in the last 30 days"
        action={
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View orders →
          </Link>
        }
      >
        <AdminTableScroll>
          {summary.topProducts.length === 0 ? (
            <AdminEmptyState
              title="No product sales in the last 30 days"
              description="Once orders are placed, top sellers will appear here."
            />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Product
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Units sold
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Line revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {summary.topProducts.map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 sm:px-6">{row.label}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700 sm:px-6">
                      {row.quantitySold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 sm:px-6">
                      {formatCurrency(row.revenue)}
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
