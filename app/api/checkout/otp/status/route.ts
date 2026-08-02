import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { normalizeEmail } from '@/lib/email/normalize';
import {
  COD_EMAIL_COOKIE,
  COD_EMAIL_COOKIE_OPTIONS,
  createVerifiedEmailCookieValue,
} from '@/lib/otp/cod-verification';
import { isGuestCodEmailVerified } from '@/lib/otp/trusted-checkout-email';

/** Check if guest email can skip COD OTP (trusted from a prior verification). */
export async function POST(req: Request) {
  const sessionUser = await getSessionUser().catch(() => null);
  if (sessionUser) {
    return NextResponse.json({ verified: true });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? '');
  if (!email) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const verified = await isGuestCodEmailVerified(email);
  if (!verified) {
    return NextResponse.json({ verified: false });
  }

  // Refresh session cookie so the current checkout does not require re-entry
  const res = NextResponse.json({ verified: true });
  res.cookies.set(COD_EMAIL_COOKIE, createVerifiedEmailCookieValue(email), COD_EMAIL_COOKIE_OPTIONS);
  return res;
}
