import { normalizeEmail } from '@/lib/email/normalize';
import { supabaseAdmin } from '@/lib/db/supabase';
import {
  getVerifiedCodEmailFromCookie,
} from '@/lib/otp/cod-verification';

/** True if this email completed COD OTP verification in the past. */
export async function isCheckoutEmailTrusted(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email) return false;

  const { data, error } = await (supabaseAdmin as any)
    .from('checkout_verified_emails')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Trusted email lookup failed:', error);
    return false;
  }

  return !!data;
}

/** Record email as trusted after successful OTP verification. */
export async function markCheckoutEmailTrusted(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  if (!email) return;

  const now = new Date().toISOString();
  const { error } = await (supabaseAdmin as any)
    .from('checkout_verified_emails')
    .upsert(
      { email, verified_at: now, last_used_at: now },
      { onConflict: 'email' },
    );

  if (error) {
    console.error('Failed to mark checkout email trusted:', error);
  }
}

/** Bump last_used_at when a trusted email places another COD order. */
export async function touchCheckoutEmailTrusted(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  if (!email) return;

  await (supabaseAdmin as any)
    .from('checkout_verified_emails')
    .update({ last_used_at: new Date().toISOString() })
    .eq('email', email);
}

/** Guest COD: valid session cookie or previously verified email in DB. */
export async function isGuestCodEmailVerified(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email) return false;

  const fromCookie = await getVerifiedCodEmailFromCookie();
  if (fromCookie === email) return true;

  return isCheckoutEmailTrusted(email);
}
