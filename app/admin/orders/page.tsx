import Link from 'next/link';
import { getOrdersForAdmin } from '@/lib/db/queries';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminTableScroll } from '@/components/admin/AdminTableScroll';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage orders</p>
      </div>

      <AdminSectionCard title="All orders" description="Latest 100 orders">
        <AdminTableScroll>
          {orders.length === 0 ? (
            <AdminEmptyState
              title="No orders yet"
              description="Orders will appear here once customers place them."
            />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 sm:px-6">
                      {order.order_number}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                      {order.user_email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 sm:px-6">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                      <AdminStatusBadge status={order.order_status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 sm:px-6">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm sm:px-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        View
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
