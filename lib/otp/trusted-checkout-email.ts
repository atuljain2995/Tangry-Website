import { eq } from 'drizzle-orm';
import { normalizeEmail } from '@/lib/email/normalize';
import { getDb, schema } from '@/lib/db';
import {
  getVerifiedCodEmailFromCookie,
} from '@/lib/otp/cod-verification';

const { checkoutVerifiedEmails: verified } = schema;

/** True if this email completed COD OTP verification in the past. */
export async function isCheckoutEmailTrusted(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email) return false;

  try {
    const rows = await getDb()
      .select({ email: verified.email })
      .from(verified)
      .where(eq(verified.email, email))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error('Trusted email lookup failed:', error);
    return false;
  }
}

/** Record email as trusted after successful OTP verification. */
export async function markCheckoutEmailTrusted(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  if (!email) return;

  const now = new Date().toISOString();
  try {
    await getDb()
      .insert(verified)
      .values({ email, verified_at: now, last_used_at: now })
      .onConflictDoUpdate({
        target: verified.email,
        set: { verified_at: now, last_used_at: now },
      });
  } catch (error) {
    console.error('Failed to mark checkout email trusted:', error);
  }
}

/** Bump last_used_at when a trusted email places another COD order. */
export async function touchCheckoutEmailTrusted(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  if (!email) return;

  await getDb()
    .update(verified)
    .set({ last_used_at: new Date().toISOString() })
    .where(eq(verified.email, email));
}

/** Guest COD: valid session cookie or previously verified email in DB. */
export async function isGuestCodEmailVerified(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email) return false;

  const fromCookie = await getVerifiedCodEmailFromCookie();
  if (fromCookie === email) return true;

  return isCheckoutEmailTrusted(email);
}
