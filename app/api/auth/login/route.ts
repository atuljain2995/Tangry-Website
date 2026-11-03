import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSessionToken, COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth/session';
import { getDb, schema } from '@/lib/db';
import { safeRedirectPath } from '@/lib/utils/safe-redirect';

/**
 * POST /api/auth/login
 * Body: { email, password, redirect? }
 * On success: 302 redirect to redirect (or /) with Set-Cookie so the browser gets the session in the same response.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const redirectTo = safeRedirectPath(body.redirect, '/');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { users } = schema;
    const [user] = await getDb()
      .select({ id: users.id, password_hash: users.password_hash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user?.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSessionToken(user.id);

    const redirectUrl = new URL(redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl, { status: 302 });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
