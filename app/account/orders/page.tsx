import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { supabaseAdmin } from '@/lib/db/supabase';

type OrderRow = {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  currency: string;
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  created_at: string;
};

async function getUserOrders(userId: string, email: string): Promise<OrderRow[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('orders')
    .select(
      'id, order_number, order_status, payment_status, payment_method, total, currency, items, created_at',
    )
    .or(`user_id.eq.${userId},user_email.eq.${email}`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Fetch user orders error:', error);
    return [];
  }
  return (data ?? []) as OrderRow[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default async function AccountOrdersPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const orders = await getUserOrders(profile.id, profile.email);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-neutral-100">Order History</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-300">You don&apos;t have any orders yet.</p>
          <p className="mt-4">
            <Link href="/products" className="text-orange-600 font-medium hover:underline">
              Browse products &rarr;
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                    #{order.order_number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                  <span className="text-base font-bold text-gray-900 dark:text-neutral-100">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-4 divide-y divide-gray-100 dark:divide-neutral-800">
                {(order.items ?? []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    {item.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-12 w-12 rounded-md object-cover border border-gray-200 dark:border-neutral-700"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        {item.variantName} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <span className="capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                </span>
                <span>·</span>
                <span className="capitalize">{order.payment_status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
