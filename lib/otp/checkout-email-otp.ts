import { and, count, desc, eq, gte } from 'drizzle-orm';
import { normalizeEmail } from '@/lib/email/normalize';
import { getDb, schema } from '@/lib/db';
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

const { checkoutEmailOtps: otps } = schema;

const deleteOtpsFor = (email: string) => getDb().delete(otps).where(eq(otps.email, email));

export async function sendCheckoutEmailOtp(
  rawEmail: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = normalizeEmail(rawEmail);
  if (!email) return { ok: false, error: 'Enter a valid email address' };

  if (await isCheckoutEmailTrusted(email)) {
    return { ok: false, error: 'This email is already verified.' };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  try {
    const [{ n }] = await getDb()
      .select({ n: count() })
      .from(otps)
      .where(and(eq(otps.email, email), gte(otps.created_at, oneHourAgo)));
    if (n >= MAX_SENDS_PER_HOUR) {
      return { ok: false, error: 'Too many requests. Try again in an hour.' };
    }

    await deleteOtpsFor(email);
    await getDb().insert(otps).values({
      email,
      code_hash: hashOtpCode(code),
      expires_at: expiresAt,
      verify_attempts: 0,
    });
  } catch (error) {
    console.error('OTP send failed:', error);
    return { ok: false, error: 'Could not send verification code. Please try again.' };
  }

  const sent = await sendOtpEmail(email, code);
  if (!sent.ok) {
    await deleteOtpsFor(email);
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

  let row: (typeof otps.$inferSelect) | undefined;
  try {
    [row] = await getDb()
      .select()
      .from(otps)
      .where(eq(otps.email, email))
      .orderBy(desc(otps.created_at))
      .limit(1);
  } catch (error) {
    console.error('OTP fetch failed:', error);
    return { ok: false, error: 'Verification failed. Please try again.' };
  }

  if (!row) return { ok: false, error: 'Code expired or not sent. Request a new one.' };

  const deleteRow = () => getDb().delete(otps).where(eq(otps.id, row.id));

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await deleteRow();
    return { ok: false, error: 'Code expired. Request a new one.' };
  }

  if (row.verify_attempts >= MAX_VERIFY_ATTEMPTS) {
    await deleteRow();
    return { ok: false, error: 'Too many wrong attempts. Request a new code.' };
  }

  const actualHash = hashOtpCode(trimmed);
  if (!timingSafeEqual(row.code_hash, actualHash)) {
    await getDb()
      .update(otps)
      .set({ verify_attempts: row.verify_attempts + 1 })
      .where(eq(otps.id, row.id));
    return { ok: false, error: 'Incorrect code. Please try again.' };
  }

  await deleteOtpsFor(email);
  await markCheckoutEmailTrusted(email);
  return { ok: true, email };
}
