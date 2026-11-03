'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/user';

const { coupons } = schema;

function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; cause?: { code?: string } };
  return e?.code === '23505' || e?.cause?.code === '23505';
}

export type CouponInput = {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  valid_from: string; // ISO date
  valid_until: string; // ISO date
  is_active?: boolean;
};

export async function createCoupon(
  input: CouponInput,
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  // Server actions are public endpoints; the admin layout guard does not cover them.
  if (!(await requireAdmin())) return { success: false, error: 'Not authorised' };
  try {
    const code = input.code.trim().toUpperCase();
    if (!code) return { success: false, error: 'Code is required' };

    const payload = {
      code,
      description: input.description.trim() || code,
      discount_type: input.discount_type,
      discount_value: Number(input.discount_value) || 0,
      min_order_value: input.min_order_value ?? null,
      max_discount: input.max_discount ?? null,
      usage_limit: input.usage_limit ?? null,
      valid_from: input.valid_from,
      valid_until: input.valid_until,
      is_active: input.is_active ?? true,
    };
    let id: string;
    try {
      [{ id }] = await getDb().insert(coupons).values(payload).returning({ id: coupons.id });
    } catch (error) {
      if (isUniqueViolation(error))
        return { success: false, error: 'A coupon with this code already exists' };
      console.error('createCoupon error:', error);
      return { success: false, error: 'Failed to create coupon' };
    }
    revalidatePath('/admin/discounts');
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function updateCoupon(
  id: string,
  input: Partial<CouponInput>,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await requireAdmin())) return { success: false, error: 'Not authorised' };
  try {
    const payload: Partial<typeof coupons.$inferInsert> = {};
    if (input.code !== undefined) payload.code = input.code.trim().toUpperCase();
    if (input.description !== undefined) payload.description = input.description.trim();
    if (input.discount_type !== undefined) payload.discount_type = input.discount_type;
    if (input.discount_value !== undefined) payload.discount_value = Number(input.discount_value);
    if (input.min_order_value !== undefined) payload.min_order_value = input.min_order_value;
    if (input.max_discount !== undefined) payload.max_discount = input.max_discount;
    if (input.usage_limit !== undefined) payload.usage_limit = input.usage_limit;
    if (input.valid_from !== undefined) payload.valid_from = input.valid_from;
    if (input.valid_until !== undefined) payload.valid_until = input.valid_until;
    if (input.is_active !== undefined) payload.is_active = input.is_active;

    try {
      await getDb().update(coupons).set(payload).where(eq(coupons.id, id));
    } catch (error) {
      if (isUniqueViolation(error))
        return { success: false, error: 'A coupon with this code already exists' };
      console.error('updateCoupon error:', error);
      return { success: false, error: 'Update failed' };
    }
    revalidatePath('/admin/discounts');
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
