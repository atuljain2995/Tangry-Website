'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';
import { updateOrderStatus, setOrderTrackingNumber } from '@/lib/actions/orders';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;

type Props = {
  orderId: string;
  currentStatus: string;
  currentTracking: string | null;
  customerEmail: string | null;
};

export function AdminOrderActions({ orderId, currentStatus, currentTracking, customerEmail }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking ?? '');
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  async function handleStatusChange(newStatus: string) {
    setSavingStatus(true);
    setMessage(null);
    const result = await updateOrderStatus(orderId, newStatus);
    setSavingStatus(false);
    if (result.success) {
      setStatus(newStatus);
      setMessage({ type: 'ok', text: 'Status updated.' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  async function handleTrackingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingTracking(true);
    setMessage(null);
    const result = await setOrderTrackingNumber(orderId, tracking.trim() || null);
    setSavingTracking(false);
    if (result.success) {
      setMessage({ type: 'ok', text: 'Tracking updated.' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Update order</h2>
      {message && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.type === 'ok' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Order status</label>
        <div className="mt-1 flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={savingStatus}
            className="block min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {savingStatus ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-orange-600" aria-label="Updating status" />
          ) : null}
        </div>
      </div>
      <form onSubmit={handleTrackingSubmit} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tracking number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. 1Z999AA10123456784"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={savingTracking}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {savingTracking ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : null}
            {savingTracking ? 'Saving…' : 'Save'}
          </button>
        </div>
        <p className="text-xs text-gray-500">Saving a tracking number will set status to &quot;shipped&quot;.</p>
      </form>

      {/* Resend confirmation email */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={async () => {
            setSendingEmail(true);
            setMessage(null);
            try {
              const res = await fetch('/api/admin/orders/resend-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
              });
              const data = await res.json();
              if (res.ok) {
                setMessage({ type: 'ok', text: `Confirmation email sent to ${customerEmail}` });
              } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send email' });
              }
            } catch {
              setMessage({ type: 'error', text: 'Network error sending email' });
            }
            setSendingEmail(false);
          }}
          disabled={sendingEmail || !customerEmail}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {sendingEmail ? 'Sending…' : 'Resend Confirmation Email'}
        </button>
        {customerEmail && (
          <p className="mt-1 text-xs text-gray-500">Will send to {customerEmail}</p>
        )}
      </div>
    </div>
  );
}
