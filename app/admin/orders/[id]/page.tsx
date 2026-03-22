import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/db/supabase';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminOrderActions } from './AdminOrderActions';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN');
}

type OrderRow = {
  id: string;
  order_number: string;
  user_email: string;
  items: unknown;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  tracking_number: string | null;
  notes: string | null;
  shipping_address: unknown;
  billing_address: unknown;
  created_at: string;
  updated_at: string;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  const o = order as unknown as OrderRow;
  const items = (o.items as { productName: string; variantName: string; quantity: number; price: number; subtotal: number }[]) ?? [];
  const shipping = (o.shipping_address as { full_name?: string; address_line1?: string; city?: string; state?: string; postal_code?: string; phone?: string }) ?? {};
  const billing = (o.billing_address as { full_name?: string; address_line1?: string }) ?? {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-orange-600">
            ← Orders
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Order {o.order_number}</h1>
          <p className="mt-1 text-sm text-gray-500">{formatDate(o.created_at)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminStatusBadge status={o.order_status} />
          <span className="text-xs text-gray-500">Payment</span>
          <AdminStatusBadge status={o.payment_status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order items */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between py-3 first:pt-0">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  {item.variantName && (
                    <p className="text-sm text-gray-500">{item.variantName} × {item.quantity}</p>
                  )}
                </div>
                <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(o.subtotal)}</span>
            </div>
            {o.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>-{formatCurrency(o.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(o.tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(o.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(o.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer & addresses */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
            <p className="mt-2 font-medium text-gray-900">{o.user_email}</p>
            <p className="text-sm text-gray-500">Payment: {o.payment_method}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>
            <p className="mt-2 text-sm text-gray-700">
              {shipping.full_name}<br />
              {shipping.address_line1}<br />
              {shipping.city}, {shipping.state} {shipping.postal_code}<br />
              {shipping.phone}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Billing address</h2>
            <p className="mt-2 text-sm text-gray-700">
              {billing.full_name}<br />
              {billing.address_line1}
            </p>
          </div>
          {o.tracking_number && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
              <p className="mt-2 font-mono text-sm text-gray-700">{o.tracking_number}</p>
            </div>
          )}
          {o.notes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <p className="mt-2 text-sm text-gray-700">{o.notes}</p>
            </div>
          )}
          <AdminOrderActions
            orderId={o.id}
            currentStatus={o.order_status}
            currentTracking={o.tracking_number}
          />
        </div>
      </div>
    </div>
  );
}
