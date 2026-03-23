'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { UserProfile } from '@/lib/auth/user';
import type { AccountAddressRow } from '@/lib/db/queries';
import {
  updateAccountProfile,
  saveAccountAddress,
  deleteAccountAddress,
  type AccountAddressInput,
} from '@/lib/actions/account';
import { Loader2, MapPin, Pencil, Plus, Trash2, User } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
  'Ladakh',
  'Jammu and Kashmir',
] as const;

type AddrDraft = Omit<AccountAddressInput, 'id'> & { id?: string };

function emptyDraft(type: 'shipping' | 'billing'): AddrDraft {
  return {
    type,
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    isDefault: false,
  };
}

function rowToDraft(row: AccountAddressRow): AddrDraft {
  return {
    id: row.id,
    type: row.type,
    fullName: row.full_name,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 ?? '',
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country || 'IN',
    isDefault: row.is_default,
  };
}

type Props = {
  profile: UserProfile;
  addresses: AccountAddressRow[];
};

export function AccountSettingsClient({ profile, addresses }: Props) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [name, setName] = useState(profile.name ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [addrDraft, setAddrDraft] = useState<AddrDraft | null>(null);
  const [addrMsg, setAddrMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pendingProfile, startProfile] = useTransition();
  const [pendingAddr, startAddr] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name ?? '');
    setPhone(profile.phone ?? '');
    setAvatarUrl(profile.avatarUrl);
  }, [profile.name, profile.phone, profile.avatarUrl]);

  function saveProfile() {
    setProfileMsg(null);
    startProfile(async () => {
      const r = await updateAccountProfile({
        name,
        phone,
        avatarUrl,
      });
      if (r.success) {
        setProfileMsg({ ok: true, text: 'Profile saved.' });
        await refreshProfile();
        router.refresh();
      } else {
        setProfileMsg({ ok: false, text: r.error });
      }
    });
  }

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.set('file', file);
      const res = await fetch('/api/account/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProfileMsg({ ok: false, text: (data?.error as string) || 'Upload failed' });
        return;
      }
      if (data.url) {
        setAvatarUrl(data.url as string);
        const r = await updateAccountProfile({
          name,
          phone,
          avatarUrl: data.url as string,
        });
        if (r.success) {
          setProfileMsg({ ok: true, text: 'Photo updated.' });
          await refreshProfile();
          router.refresh();
        } else {
          setProfileMsg({ ok: false, text: r.error });
        }
      }
    } catch {
      setProfileMsg({ ok: false, text: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  }

  function removeAvatar() {
    setAvatarUrl(null);
    startProfile(async () => {
      const r = await updateAccountProfile({ name, phone, avatarUrl: null });
      if (r.success) {
        setProfileMsg({ ok: true, text: 'Photo removed.' });
        await refreshProfile();
        router.refresh();
      } else {
        setProfileMsg({ ok: false, text: r.error });
      }
    });
  }

  function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!addrDraft) return;
    setAddrMsg(null);
    startAddr(async () => {
      const r = await saveAccountAddress({
        id: addrDraft.id,
        type: addrDraft.type,
        fullName: addrDraft.fullName,
        phone: addrDraft.phone,
        addressLine1: addrDraft.addressLine1,
        addressLine2: addrDraft.addressLine2,
        city: addrDraft.city,
        state: addrDraft.state,
        postalCode: addrDraft.postalCode,
        country: addrDraft.country,
        isDefault: addrDraft.isDefault,
      });
      if (r.success) {
        setAddrDraft(null);
        setAddrMsg({ ok: true, text: 'Address saved.' });
        router.refresh();
      } else {
        setAddrMsg({ ok: false, text: r.error });
      }
    });
  }

  async function removeAddress(id: string) {
    if (!confirm('Remove this address?')) return;
    setDeletingId(id);
    setAddrMsg(null);
    const r = await deleteAccountAddress(id);
    setDeletingId(null);
    if (r.success) {
      setAddrMsg({ ok: true, text: 'Address removed.' });
      router.refresh();
    } else {
      setAddrMsg({ ok: false, text: r.error });
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';

  return (
    <div className="space-y-8">
      {/* Profile */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <User className="h-5 w-5 text-orange-600" aria-hidden />
          Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">Update how we show your name and contact you.</p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-uploaded dynamic URLs
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                  {(name || profile.email).slice(0, 1).toUpperCase()}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-8 w-8 animate-spin text-white" aria-hidden />
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <label className="cursor-pointer rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700">
                {uploading ? 'Uploading…' : 'Change photo'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onAvatarFile} disabled={uploading} />
              </label>
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-600">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="acc-name">
                Name
              </label>
              <input id="acc-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="acc-phone">
                Mobile
              </label>
              <input
                id="acc-phone"
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              onClick={saveProfile}
              disabled={pendingProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {pendingProfile ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Save profile
            </button>
            {profileMsg && (
              <p className={`text-sm ${profileMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{profileMsg.text}</p>
            )}
          </div>
        </div>
      </section>

      {/* Addresses */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MapPin className="h-5 w-5 text-orange-600" aria-hidden />
            Saved addresses
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAddrDraft(emptyDraft('shipping'))}
              className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-900 hover:bg-orange-100"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add shipping
            </button>
            <button
              type="button"
              onClick={() => setAddrDraft(emptyDraft('billing'))}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add billing
            </button>
          </div>
        </div>

        {addrMsg && (
          <p className={`mt-4 text-sm ${addrMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{addrMsg.text}</p>
        )}

        {addrDraft && (
          <form onSubmit={submitAddress} className="mt-6 space-y-4 rounded-lg border border-orange-200 bg-orange-50/40 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {addrDraft.id ? 'Edit address' : 'New address'} ({addrDraft.type})
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-700">Full name</label>
                <input
                  className={inputCls}
                  value={addrDraft.fullName}
                  onChange={(e) => setAddrDraft({ ...addrDraft, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Phone</label>
                <input
                  className={inputCls}
                  value={addrDraft.phone}
                  onChange={(e) => setAddrDraft({ ...addrDraft, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  required
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">PIN code</label>
                <input
                  className={inputCls}
                  value={addrDraft.postalCode}
                  onChange={(e) => setAddrDraft({ ...addrDraft, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  required
                  inputMode="numeric"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-700">Address line 1</label>
                <input
                  className={inputCls}
                  value={addrDraft.addressLine1}
                  onChange={(e) => setAddrDraft({ ...addrDraft, addressLine1: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-700">Address line 2 (optional)</label>
                <input
                  className={inputCls}
                  value={addrDraft.addressLine2 ?? ''}
                  onChange={(e) => setAddrDraft({ ...addrDraft, addressLine2: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">City</label>
                <input
                  className={inputCls}
                  value={addrDraft.city}
                  onChange={(e) => setAddrDraft({ ...addrDraft, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">State</label>
                <select
                  className={inputCls}
                  value={addrDraft.state}
                  onChange={(e) => setAddrDraft({ ...addrDraft, state: e.target.value })}
                  required
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={addrDraft.isDefault}
                  onChange={(e) => setAddrDraft({ ...addrDraft, isDefault: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Set as default {addrDraft.type} address</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pendingAddr}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {pendingAddr ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save address
              </button>
              <button
                type="button"
                onClick={() => setAddrDraft(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <ul className="mt-6 space-y-3">
          {addresses.length === 0 && !addrDraft && (
            <li className="text-sm text-gray-500">No saved addresses yet. Add one for faster checkout.</li>
          )}
          {addresses.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 text-sm text-gray-800">
                <p className="font-semibold text-gray-900">
                  {row.full_name}
                  <span className="ml-2 font-normal text-gray-500">({row.type})</span>
                  {row.is_default && (
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-gray-600">
                  {row.phone}
                  <br />
                  {row.address_line1}
                  {row.address_line2 ? `, ${row.address_line2}` : ''}
                  <br />
                  {row.city}, {row.state} {row.postal_code}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setAddrDraft(rowToDraft(row))}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeAddress(row.id)}
                  disabled={deletingId === row.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Trash2 className="h-3.5 w-3.5" aria-hidden />}
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link href="/account/orders" className="font-medium text-orange-600 hover:underline">
          View orders →
        </Link>
      </p>
      <p>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}
