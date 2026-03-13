import Link from 'next/link';
import {
  getOrdersForAdmin,
  getProductsCount,
  getLowStockVariantsCount,
  getOrdersTotalToday,
} from '@/lib/db/queries';

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  const cls = styles[status] ?? 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const [recentOrders, productsCount, lowStockCount, ordersTotalToday] = await Promise.all([
    getOrdersForAdmin(10),
    getProductsCount(),
    getLowStockVariantsCount(10),
    getOrdersTotalToday(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your store</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Orders today</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(ordersTotalToday)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total products</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{productsCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Low stock variants</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{lowStockCount}</p>
          {lowStockCount > 0 && (
            <Link
              href="/admin/products"
              className="mt-2 inline-block text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View products →
            </Link>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Recent orders</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{recentOrders.length}</p>
          <Link
            href="/admin/orders"
            className="mt-2 inline-block text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View all orders →
          </Link>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent orders</h2>
          <p className="mt-1 text-sm text-gray-500">Latest orders from your store</p>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No orders yet. Orders will appear here once customers place them.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '640px' }}>
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
                {recentOrders.map((order) => (
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
                      <StatusBadge status={order.order_status} />
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
        </div>
      </div>
    </div>
  );
}
