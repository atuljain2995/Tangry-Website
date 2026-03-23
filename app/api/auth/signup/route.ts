import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createSessionToken, COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';
import { safeRedirectPath } from '@/lib/utils/safe-redirect';

const SALT_ROUNDS = 10;

type UsersTable = {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => Promise<{ data: unknown }> };
    insert: (r: object) => { select: (c: string) => { single: () => Promise<{ data: unknown; error: unknown }> } };
  };
};
const db = supabaseAdmin as unknown as UsersTable;

/**
 * POST /api/auth/signup
 * Body: { email, password, name?, redirect? }
 * On success: 302 redirect with Set-Cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const name = typeof body.name === 'string' ? body.name.trim() || null : null;
    const redirectTo = safeRedirectPath(body.redirect, '/');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const { data: existing } = await db.from('users').select('id').eq('email', email);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: newUser, error } = await db
      .from('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        role: 'customer',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Signup insert error:', error);
      return NextResponse.json({ error: 'Could not create account. Try again.' }, { status: 500 });
    }

    const userId = newUser && typeof newUser === 'object' && 'id' in newUser ? (newUser as { id: string }).id : null;
    if (!userId) {
      return NextResponse.json({ error: 'Could not create account. Try again.' }, { status: 500 });
    }

    const token = await createSessionToken(userId);

    const redirectUrl = new URL(redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl, { status: 302 });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (e) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
