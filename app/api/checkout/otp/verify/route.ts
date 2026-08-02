import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { verifyCheckoutEmailOtp } from '@/lib/otp/checkout-email-otp';
import {
  COD_EMAIL_COOKIE,
  COD_EMAIL_COOKIE_OPTIONS,
  createVerifiedEmailCookieValue,
} from '@/lib/otp/cod-verification';

export async function POST(req: Request) {
  const sessionUser = await getSessionUser().catch(() => null);
  if (sessionUser) {
    return NextResponse.json(
      { error: 'Signed-in customers do not need email verification.' },
      { status: 400 },
    );
  }

  let body: { email?: string; otp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await verifyCheckoutEmailOtp(body.email ?? '', body.otp ?? '');
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, email: result.email });
  res.cookies.set(
    COD_EMAIL_COOKIE,
    createVerifiedEmailCookieValue(result.email),
    COD_EMAIL_COOKIE_OPTIONS,
  );
  return res;
}
