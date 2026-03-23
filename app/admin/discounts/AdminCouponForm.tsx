'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLink } from '@/components/admin/AdminLink';
import { createCoupon, updateCoupon, type CouponInput } from '@/lib/actions/admin-coupons';
import type { AdminCouponRow } from '@/lib/db/queries';

type Props =
  | { mode: 'new' }
  | { mode: 'edit'; coupon: AdminCouponRow };

export function AdminCouponForm(props: Props) {
  const router = useRouter();
  const [isNavPending, startTransition] = useTransition();
  const isEdit = props.mode === 'edit';
  const coupon = isEdit ? props.coupon : null;

  const [code, setCode] = useState(coupon?.code ?? '');
  const [description, setDescription] = useState(coupon?.description ?? '');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(coupon?.discount_type === 'fixed' ? 'fixed' : 'percentage');
  const [discountValue, setDiscountValue] = useState(String(coupon?.discount_value ?? ''));
  const [minOrderValue, setMinOrderValue] = useState(coupon?.min_order_value != null ? String(coupon.min_order_value) : '');
  const [maxDiscount, setMaxDiscount] = useState(coupon?.max_discount != null ? String(coupon.max_discount) : '');
  const [usageLimit, setUsageLimit] = useState(coupon?.usage_limit != null ? String(coupon.usage_limit) : '');
  const [validFrom, setValidFrom] = useState(coupon?.valid_from ? coupon.valid_from.slice(0, 16) : '');
  const [validUntil, setValidUntil] = useState(coupon?.valid_until ? coupon.valid_until.slice(0, 16) : '');
  const [isActive, setIsActive] = useState(coupon?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const fromDate = validFrom ? new Date(validFrom).toISOString() : new Date().toISOString();
    const toDate = validUntil ? new Date(validUntil).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (isEdit && coupon) {
      const result = await updateCoupon(coupon.id, {
        code,
        description,
        discount_type: discountType,
        discount_value: parseFloat(discountValue) || 0,
        min_order_value: minOrderValue === '' ? null : parseFloat(minOrderValue) || null,
        max_discount: maxDiscount === '' ? null : parseFloat(maxDiscount) || null,
        usage_limit: usageLimit === '' ? null : parseInt(usageLimit, 10) || null,
        valid_from: fromDate,
        valid_until: toDate,
        is_active: isActive,
      });
      setSaving(false);
      if (result.success) {
        setMessage({ type: 'ok', text: 'Saved.' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } else {
      const input: CouponInput = {
        code,
        description,
        discount_type: discountType,
        discount_value: parseFloat(discountValue) || 0,
        min_order_value: minOrderValue === '' ? null : parseFloat(minOrderValue) || null,
        max_discount: maxDiscount === '' ? null : parseFloat(maxDiscount) || null,
        usage_limit: usageLimit === '' ? null : parseInt(usageLimit, 10) || null,
        valid_from: fromDate,
        valid_until: toDate,
        is_active: isActive,
      };
      const result = await createCoupon(input);
      setSaving(false);
      if (result.success) {
        startTransition(() => {
          router.push(`/admin/discounts/${result.id}`);
          router.refresh();
        });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            message.type === 'ok' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. WELCOME10"
            className="w-full rounded border border-gray-300 px-3 py-2 font-mono uppercase"
            required
            disabled={isEdit}
          />
          {isEdit && <p className="mt-1 text-xs text-gray-500">Code cannot be changed after creation.</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value {discountType === 'percentage' ? '(%)' : '(₹)'}
            </label>
            <input
              type="number"
              step={discountType === 'percentage' ? 1 : 0.01}
              min="0"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min order value (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max discount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage limit</label>
          <input
            type="number"
            min="0"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="Unlimited"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid from</label>
            <input
              type="datetime-local"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid until</label>
            <input
              type="datetime-local"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300" />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || isNavPending}
          className="inline-flex items-center justify-center gap-2 rounded bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {(saving || isNavPending) && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />}
          {saving ? 'Saving…' : isNavPending ? 'Opening…' : isEdit ? 'Save' : 'Create coupon'}
        </button>
        <AdminLink
          href="/admin/discounts"
          className={`rounded border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 ${saving || isNavPending ? 'pointer-events-none opacity-50' : ''}`}
          onClick={(e) => {
            if (saving || isNavPending) e.preventDefault();
          }}
        >
          Cancel
        </AdminLink>
      </div>
    </form>
  );
}
