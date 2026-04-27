'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { supabaseAdmin } from '@/lib/db/supabase';
import { validatePinCode } from '@/lib/utils/database';

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

  const update: Record<string, string | null> = {
    name,
    phone,
    updated_at: new Date().toISOString(),
  };
  if (form.avatarUrl !== undefined) {
    update.avatar_url = form.avatarUrl?.trim() || null;
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update(update as never)
    .eq('id', profile.id);

  if (error) {
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
  await supabaseAdmin
    .from('addresses')
    .update({ is_default: false, updated_at: new Date().toISOString() } as never)
    .eq('user_id', userId)
    .eq('type', type)
    .neq('id', keepId);
  await supabaseAdmin
    .from('addresses')
    .update({ is_default: true, updated_at: new Date().toISOString() } as never)
    .eq('id', keepId)
    .eq('user_id', userId);
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

  if (input.id) {
    const { data: existing } = await supabaseAdmin
      .from('addresses')
      .select('id, user_id')
      .eq('id', input.id)
      .single();
    const row = existing as { user_id: string } | null;
    if (!row || row.user_id !== profile.id) {
      return { success: false, error: 'Address not found' };
    }
    const { error } = await supabaseAdmin
      .from('addresses')
      .update(base as never)
      .eq('id', input.id);
    if (error) {
      console.error('saveAccountAddress update', error);
      return { success: false, error: 'Could not update address' };
    }
    addressId = input.id;
  } else {
    const { data: ins, error } = await supabaseAdmin
      .from('addresses')
      .insert({
        ...base,
        created_at: new Date().toISOString(),
      } as never)
      .select('id')
      .single();
    if (error || !ins) {
      console.error('saveAccountAddress insert', error);
      return { success: false, error: 'Could not save address' };
    }
    addressId = (ins as { id: string }).id;
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

  const { error } = await supabaseAdmin
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', profile.id);

  if (error) {
    console.error('deleteAccountAddress', error);
    return { success: false, error: 'Could not remove address' };
  }
  revalidatePath('/account');
  return { success: true };
}
