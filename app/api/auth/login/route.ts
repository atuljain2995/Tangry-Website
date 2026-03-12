import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createSessionToken, COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';

type UsersTable = {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => Promise<{ data: unknown }> };
  };
};
const db = supabaseAdmin as unknown as UsersTable;

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
    const redirectTo = typeof body.redirect === 'string' && body.redirect.startsWith('/')
      ? body.redirect
      : '/';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { data: rows } = await db.from('users').select('id, password_hash').eq('email', email);
    const user = Array.isArray(rows) ? rows[0] : rows;
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordHash = (user as { password_hash: string | null }).password_hash;
    if (!passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, passwordHash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userId = (user as { id: string }).id;
    const token = await createSessionToken(userId);

    const redirectUrl = new URL(redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl, { status: 302 });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
