'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { AccountAddressRow } from '@/lib/db/queries';
import {
  saveAccountAddress,
  deleteAccountAddress,
  type AccountAddressInput,
} from '@/lib/actions/account';
import { Loader2, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir',
] as const;

type AddrDraft = Omit<AccountAddressInput, 'id'> & { id?: string };

function emptyDraft(type: 'shipping' | 'billing'): AddrDraft {
  return { type, fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'IN', isDefault: false };
}

function rowToDraft(row: AccountAddressRow): AddrDraft {
  return {
    id: row.id, type: row.type, fullName: row.full_name, phone: row.phone,
    addressLine1: row.address_line1, addressLine2: row.address_line2 ?? '',
    city: row.city, state: row.state, postalCode: row.postal_code,
    country: row.country || 'IN', isDefault: row.is_default,
  };
}

export function AddressesClient({ addresses }: { addresses: AccountAddressRow[] }) {
  const router = useRouter();
  const [addrDraft, setAddrDraft] = useState<AddrDraft | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingAddr, startAddr] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100';

  function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!addrDraft) return;
    setMsg(null);
    startAddr(async () => {
      const r = await saveAccountAddress({ ...addrDraft });
      if (r.success) { setAddrDraft(null); setMsg({ ok: true, text: 'Address saved.' }); router.refresh(); }
      else setMsg({ ok: false, text: r.error });
    });
  }

  async function removeAddress(id: string) {
    if (!confirm('Remove this address?')) return;
    setDeletingId(id); setMsg(null);
    const r = await deleteAccountAddress(id);
    setDeletingId(null);
    if (r.success) { setMsg({ ok: true, text: 'Address removed.' }); router.refresh(); }
    else setMsg({ ok: false, text: r.error });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setAddrDraft(emptyDraft('shipping'))}
          className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          <Plus className="h-4 w-4" aria-hidden /> Add Shipping Address
        </button>
        <button type="button" onClick={() => setAddrDraft(emptyDraft('billing'))}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <Plus className="h-4 w-4" aria-hidden /> Add Billing Address
        </button>
      </div>

      {msg && <p className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}

      {addrDraft && (
        <form onSubmit={submitAddress} className="space-y-4 rounded-xl border border-orange-200 bg-orange-50/40 p-5 dark:border-orange-800 dark:bg-orange-950/30">
          <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
            {addrDraft.id ? 'Edit address' : 'New address'} ({addrDraft.type})
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">Full name</label>
              <input className={inputCls} value={addrDraft.fullName} onChange={(e) => setAddrDraft({ ...addrDraft, fullName: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">Phone</label>
              <input className={inputCls} value={addrDraft.phone} onChange={(e) => setAddrDraft({ ...addrDraft, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} required inputMode="numeric" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">PIN code</label>
              <input className={inputCls} value={addrDraft.postalCode} onChange={(e) => setAddrDraft({ ...addrDraft, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })} required inputMode="numeric" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">Address line 1</label>
              <input className={inputCls} value={addrDraft.addressLine1} onChange={(e) => setAddrDraft({ ...addrDraft, addressLine1: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">Address line 2 (optional)</label>
              <input className={inputCls} value={addrDraft.addressLine2 ?? ''} onChange={(e) => setAddrDraft({ ...addrDraft, addressLine2: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">City</label>
              <input className={inputCls} value={addrDraft.city} onChange={(e) => setAddrDraft({ ...addrDraft, city: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-neutral-300">State</label>
              <select className={inputCls} value={addrDraft.state} onChange={(e) => setAddrDraft({ ...addrDraft, state: e.target.value })} required>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={addrDraft.isDefault} onChange={(e) => setAddrDraft({ ...addrDraft, isDefault: e.target.checked })} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700 dark:text-neutral-300">Set as default {addrDraft.type} address</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={pendingAddr}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50">
              {pendingAddr ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Save
            </button>
            <button type="button" onClick={() => setAddrDraft(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !addrDraft && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex flex-col items-center gap-2 text-center">
            <MapPin className="h-8 w-8 text-gray-300 dark:text-neutral-600" />
            <p className="text-gray-600 dark:text-neutral-300">No saved addresses yet.</p>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Add an address for faster checkout.</p>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {addresses.map((row) => (
          <li key={row.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 text-sm text-gray-800 dark:text-neutral-200">
              <p className="font-semibold text-gray-900 dark:text-neutral-100">
                {row.full_name}
                <span className="ml-2 font-normal text-gray-500 dark:text-neutral-400">({row.type})</span>
                {row.is_default && (
                  <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">Default</span>
                )}
              </p>
              <p className="mt-1 text-gray-600 dark:text-neutral-400">
                {row.phone}<br />
                {row.address_line1}{row.address_line2 ? `, ${row.address_line2}` : ''}<br />
                {row.city}, {row.state} {row.postal_code}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setAddrDraft(rowToDraft(row))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
              </button>
              <button type="button" onClick={() => removeAddress(row.id)} disabled={deletingId === row.id}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
                {deletingId === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Trash2 className="h-3.5 w-3.5" aria-hidden />} Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
