'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, ne } from 'drizzle-orm';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { getDb, schema } from '@/lib/db';
import { validatePinCode } from '@/lib/utils/database';

const { users, addresses } = schema;

export async function updateAccountProfile(form: {
  name: string;
  phone: string;
  avatarUrl?: string | null;
}): Promise<{ success: true } | { success: false; error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  const name = form.name.trim() || null;
  const phone = form.phone.trim() || null;
  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    return { success: false, error: 'Enter a valid 10-digit mobile number' };
  }

  const update: Partial<typeof users.$inferInsert> = {
    name,
    phone,
    updated_at: new Date().toISOString(),
  };
  if (form.avatarUrl !== undefined) {
    update.avatar_url = form.avatarUrl?.trim() || null;
  }

  try {
    await getDb().update(users).set(update).where(eq(users.id, profile.id));
  } catch (error) {
    console.error('updateAccountProfile', error);
    return { success: false, error: 'Could not update profile' };
  }
  revalidatePath('/account');
  return { success: true };
}

export type AccountAddressInput = {
  id?: string;
  type: 'shipping' | 'billing';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
};

async function enforceSingleDefault(
  userId: string,
  type: 'shipping' | 'billing',
  keepId: string,
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .update(addresses)
    .set({ is_default: false, updated_at: now })
    .where(and(eq(addresses.user_id, userId), eq(addresses.type, type), ne(addresses.id, keepId)));
  await db
    .update(addresses)
    .set({ is_default: true, updated_at: now })
    .where(and(eq(addresses.id, keepId), eq(addresses.user_id, userId)));
}

export async function saveAccountAddress(
  input: AccountAddressInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  if (!input.fullName?.trim()) return { success: false, error: 'Name is required' };
  if (!input.phone?.trim() || !/^[6-9]\d{9}$/.test(input.phone.trim())) {
    return { success: false, error: 'Valid 10-digit phone required' };
  }
  if (!input.addressLine1?.trim()) return { success: false, error: 'Address is required' };
  if (!input.city?.trim() || !input.state?.trim()) {
    return { success: false, error: 'City and state are required' };
  }
  if (!validatePinCode(input.postalCode?.trim() ?? '')) {
    return { success: false, error: 'Invalid PIN code' };
  }

  const base = {
    user_id: profile.id,
    type: input.type,
    full_name: input.fullName.trim(),
    phone: input.phone.trim(),
    address_line1: input.addressLine1.trim(),
    address_line2: input.addressLine2?.trim() || null,
    city: input.city.trim(),
    state: input.state.trim(),
    postal_code: input.postalCode.trim(),
    country: input.country?.trim() || 'IN',
    is_default: !!input.isDefault,
    updated_at: new Date().toISOString(),
  };

  let addressId: string;
  const db = getDb();

  if (input.id) {
    const [row] = await db
      .select({ user_id: addresses.user_id })
      .from(addresses)
      .where(eq(addresses.id, input.id))
      .limit(1);
    if (!row || row.user_id !== profile.id) {
      return { success: false, error: 'Address not found' };
    }
    try {
      await db.update(addresses).set(base).where(eq(addresses.id, input.id));
    } catch (error) {
      console.error('saveAccountAddress update', error);
      return { success: false, error: 'Could not update address' };
    }
    addressId = input.id;
  } else {
    try {
      [{ id: addressId }] = await db
        .insert(addresses)
        .values({ ...base, created_at: new Date().toISOString() })
        .returning({ id: addresses.id });
    } catch (error) {
      console.error('saveAccountAddress insert', error);
      return { success: false, error: 'Could not save address' };
    }
  }

  if (input.isDefault) {
    await enforceSingleDefault(profile.id, input.type, addressId);
  }

  revalidatePath('/account');
  return { success: true };
}

export async function deleteAccountAddress(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { success: false, error: 'Not signed in' };

  try {
    await getDb()
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.user_id, profile.id)));
  } catch (error) {
    console.error('deleteAccountAddress', error);
    return { success: false, error: 'Could not remove address' };
  }
  revalidatePath('/account');
  return { success: true };
}
