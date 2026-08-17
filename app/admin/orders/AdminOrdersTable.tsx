'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { AdminLink } from '@/components/admin/AdminLink';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import {
  bulkDeleteOrders,
  bulkUpdateOrderStatus,
  deleteOrder,
  updateOrderStatus,
} from '@/lib/actions/orders';

const STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export type AdminOrderRow = {
  id: string;
  order_number: string;
  user_email: string | null;
  total: number;
  order_status: string;
  payment_status: string | null;
  created_at: string;
};

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
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ageInDays(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

// The select doubles as the status indicator, so it carries the colour itself.
const STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-300 bg-amber-50 text-amber-900',
  confirmed: 'border-blue-300 bg-blue-50 text-blue-900',
  processing: 'border-indigo-300 bg-indigo-50 text-indigo-900',
  shipped: 'border-purple-300 bg-purple-50 text-purple-900',
  delivered: 'border-green-300 bg-green-50 text-green-900',
  cancelled: 'border-gray-300 bg-gray-100 text-gray-700',
  refunded: 'border-red-300 bg-red-50 text-red-900',
};

export function AdminOrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>('processing');
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  // Statuses already written to the DB but not yet reflected in the server props.
  // Without this the select snaps back to the old value mid-refresh and looks like a failure.
  // Each entry records the server value it replaced, so it self-clears once the server moves off it.
  const [optimistic, setOptimistic] = useState<Record<string, { from: string; to: string }>>({});

  const { rows, awaiting } = useMemo(() => {
    const pendingIds = new Set<string>();
    const merged = orders.map((o) => {
      const ov = optimistic[o.id];
      if (ov && o.order_status === ov.from) {
        pendingIds.add(o.id);
        return { ...o, order_status: ov.to };
      }
      return o;
    });
    return { rows: merged, awaiting: pendingIds };
  }, [orders, optimistic]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const o of rows) c[o.order_status] = (c[o.order_status] ?? 0) + 1;
    return c;
  }, [rows]);

  const visible = useMemo(
    () => (filter === 'all' ? rows : rows.filter((o) => o.order_status === filter)),
    [rows, filter],
  );

  const allVisibleSelected = visible.length > 0 && visible.every((o) => selected.has(o.id));
  const someVisibleSelected = visible.some((o) => selected.has(o.id)) && !allVisibleSelected;

  function toggleAll() {
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map((o) => o.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleRowStatus(id: string, status: string) {
    const from = orders.find((o) => o.id === id)?.order_status;
    setRowBusy(id);
    setMessage(null);
    const res = await updateOrderStatus(id, status);
    setRowBusy(null);
    if (res.success) {
      if (from) setOptimistic((prev) => ({ ...prev, [id]: { from, to: status } }));
      setMessage({ type: 'ok', text: `Order updated to ${status}.` });
      startTransition(() => router.refresh());
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  }

  async function handleBulk() {
    if (selected.size === 0) return;
    setMessage(null);
    const ids = [...selected];
    const res = await bulkUpdateOrderStatus(ids, bulkStatus);
    if (res.success) {
      setOptimistic((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const from = orders.find((o) => o.id === id)?.order_status;
          if (from) next[id] = { from, to: bulkStatus };
        }
        return next;
      });
      setMessage({ type: 'ok', text: `${res.updated} order(s) updated to ${bulkStatus}.` });
      setSelected(new Set());
      startTransition(() => router.refresh());
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    setMessage(null);
    const ids = [...selected];
    const res = await bulkDeleteOrders(ids);
    setConfirmBulkDelete(false);
    if (res.success) {
      setMessage({ type: 'ok', text: `${res.deleted} order(s) deleted.` });
      setSelected(new Set());
      startTransition(() => router.refresh());
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  }

  async function handleDelete(id: string) {
    setRowBusy(id);
    setMessage(null);
    const res = await deleteOrder(id);
    setRowBusy(null);
    setConfirmDelete(null);
    if (res.success) {
      setMessage({ type: 'ok', text: 'Order deleted.' });
      startTransition(() => router.refresh());
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  }

  if (orders.length === 0) {
    return (
      <AdminEmptyState
        title="No orders yet"
        description="Orders will appear here once customers place them."
      />
    );
  }

  return (
    <div>
      {/* One toolbar slot: bulk actions take over the filter row instead of stacking below it. */}
      {/* Padding matches the table cells so controls line up with the Order column. */}
      <div className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-200 px-4 py-3">
        {selected.size > 0 ? (
          <>
            <span className="text-sm font-medium text-gray-900">
              {selected.size} selected
            </span>

            <span className="flex items-center gap-1.5">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                aria-label="Bulk status"
                className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulk}
                disabled={isPending}
                className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                Apply
              </button>
            </span>

            {confirmBulkDelete ? (
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete {selected.size} permanently
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmBulkDelete(false)}
                  className="rounded-md px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmBulkDelete(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelected(new Set());
                setConfirmBulkDelete(false);
              }}
              className="ml-auto rounded-md px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear selection
            </button>
          </>
        ) : (
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-gray-100 p-1">
            {['all', ...STATUSES].map((s) => {
              const n = counts[s] ?? 0;
              if (s !== 'all' && n === 0) return null;
              const active = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  aria-pressed={active}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    active
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {s}
                  <span
                    className={`ml-1.5 tabular-nums ${active ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {message && (
          <span
            role="status"
            className={`text-sm ${
              selected.size > 0 ? '' : 'ml-auto'
            } ${message.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}
          >
            {message.text}
          </span>
        )}
      </div>

      {/* Only the table scrolls sideways — the toolbar above stays put. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 sm:px-4">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someVisibleSelected;
                }}
                onChange={toggleAll}
                aria-label="Select all visible orders"
                className="h-4 w-4 rounded border-gray-300 text-orange-600"
              />
            </th>
            {['Order', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {h}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {visible.map((order) => {
            const stale = order.order_status === 'pending' && ageInDays(order.created_at) >= 3;
            return (
              <tr
                key={order.id}
                className={stale ? 'bg-amber-50/60 hover:bg-amber-100/60' : 'hover:bg-gray-50'}
              >
                <td className="px-3 py-3 sm:px-4">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleOne(order.id)}
                    aria-label={`Select order ${order.order_number}`}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-1.5">
                    {order.order_number}
                    {stale && (
                      <span
                        title={`Pending for ${ageInDays(order.created_at)} days`}
                        className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
                      >
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {ageInDays(order.created_at)}d
                      </span>
                    )}
                  </div>
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-600">
                  <span title={order.user_email ?? undefined}>{order.user_email}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleRowStatus(order.id, e.target.value)}
                      disabled={rowBusy === order.id || (isPending && awaiting.has(order.id))}
                      aria-label={`Status for order ${order.order_number}`}
                      className={`rounded-md border px-2 py-1 text-xs font-medium capitalize focus:ring-2 focus:ring-orange-500 disabled:opacity-60 ${
                        STATUS_STYLES[order.order_status] ?? 'border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {(rowBusy === order.id || (isPending && awaiting.has(order.id))) && (
                      <Loader2 className="h-4 w-4 animate-spin text-orange-600" aria-hidden="true" />
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                  <div>{formatDate(order.created_at)}</div>
                  <div className="text-xs text-gray-400">{formatTime(order.created_at)}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  {confirmDelete === order.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(order.id)}
                        className="font-medium text-red-600 hover:text-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-3">
                      <AdminLink
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        View
                      </AdminLink>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(order.id)}
                        title="Delete order"
                        aria-label={`Delete order ${order.order_number}`}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}
