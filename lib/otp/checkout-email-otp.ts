import { normalizeEmail } from '@/lib/email/normalize';
import { supabaseAdmin } from '@/lib/db/supabase';
import {
  generateOtpCode,
  hashOtpCode,
  timingSafeEqual,
} from '@/lib/otp/cod-verification';
import { sendOtpEmail } from '@/lib/otp/send-email-otp';
import { isCheckoutEmailTrusted, markCheckoutEmailTrusted } from '@/lib/otp/trusted-checkout-email';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

type OtpRow = {
  id: string;
  email: string;
  code_hash: string;
  expires_at: string;
  verify_attempts: number;
  created_at: string;
};

export async function sendCheckoutEmailOtp(
  rawEmail: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = normalizeEmail(rawEmail);
  if (!email) return { ok: false, error: 'Enter a valid email address' };

  if (await isCheckoutEmailTrusted(email)) {
    return { ok: false, error: 'This email is already verified.' };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await (supabaseAdmin as any)
    .from('checkout_email_otps')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', oneHourAgo);

  if (countError) {
    console.error('OTP rate-limit check failed:', countError);
    return { ok: false, error: 'Could not send verification code. Please try again.' };
  }
  if ((count ?? 0) >= MAX_SENDS_PER_HOUR) {
    return { ok: false, error: 'Too many requests. Try again in an hour.' };
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await (supabaseAdmin as any).from('checkout_email_otps').delete().eq('email', email);

  const { error: insertError } = await (supabaseAdmin as any).from('checkout_email_otps').insert({
    email,
    code_hash: hashOtpCode(code),
    expires_at: expiresAt,
    verify_attempts: 0,
  });

  if (insertError) {
    console.error('OTP insert failed:', insertError);
    return { ok: false, error: 'Could not send verification code. Please try again.' };
  }

  const sent = await sendOtpEmail(email, code);
  if (!sent.ok) {
    await (supabaseAdmin as any).from('checkout_email_otps').delete().eq('email', email);
    return sent;
  }

  return { ok: true };
}

export async function verifyCheckoutEmailOtp(
  rawEmail: string,
  code: string,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const email = normalizeEmail(rawEmail);
  if (!email) return { ok: false, error: 'Invalid email address' };

  const trimmed = code.replace(/\D/g, '');
  if (trimmed.length !== 6) return { ok: false, error: 'Enter the 6-digit code' };

  const { data, error } = await (supabaseAdmin as any)
    .from('checkout_email_otps')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('OTP fetch failed:', error);
    return { ok: false, error: 'Verification failed. Please try again.' };
  }

  const row = data as OtpRow | null;
  if (!row) return { ok: false, error: 'Code expired or not sent. Request a new one.' };

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await (supabaseAdmin as any).from('checkout_email_otps').delete().eq('id', row.id);
    return { ok: false, error: 'Code expired. Request a new one.' };
  }

  if (row.verify_attempts >= MAX_VERIFY_ATTEMPTS) {
    await (supabaseAdmin as any).from('checkout_email_otps').delete().eq('id', row.id);
    return { ok: false, error: 'Too many wrong attempts. Request a new code.' };
  }

  const actualHash = hashOtpCode(trimmed);
  if (!timingSafeEqual(row.code_hash, actualHash)) {
    await (supabaseAdmin as any)
      .from('checkout_email_otps')
      .update({ verify_attempts: row.verify_attempts + 1 })
      .eq('id', row.id);
    return { ok: false, error: 'Incorrect code. Please try again.' };
  }

  await (supabaseAdmin as any).from('checkout_email_otps').delete().eq('email', email);
  await markCheckoutEmailTrusted(email);
  return { ok: true, email };
}
