import { getOrdersForAdmin } from '@/lib/db/queries';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminOrdersTable } from './AdminOrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update status inline, or select multiple orders to update them together.
        </p>
      </div>

      <AdminSectionCard title="All orders" description={`Showing ${orders.length} most recent`}>
        <AdminOrdersTable orders={orders} />
      </AdminSectionCard>
    </div>
  );
}
