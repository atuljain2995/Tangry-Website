import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { sendCheckoutEmailOtp } from '@/lib/otp/checkout-email-otp';

export async function POST(req: Request) {
  const sessionUser = await getSessionUser().catch(() => null);
  if (sessionUser) {
    return NextResponse.json(
      { error: 'Signed-in customers do not need email verification.' },
      { status: 400 },
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await sendCheckoutEmailOtp(body.email ?? '');
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
