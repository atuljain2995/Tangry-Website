import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/db/supabase';
import type { UserProfile } from './user';

export const COOKIE_NAME = 'tangry_sid';
export const SESSION_DAYS = 7;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60,
  path: '/',
};

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create session in DB and return token. Use this in Route Handlers so you can set the cookie on the redirect response.
 */
export async function createSessionToken(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await db.from('sessions').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  return token;
}

type SessionsTable = {
  from: (t: string) => {
    insert: (r: object) => Promise<{ error: unknown }>;
    select: (c: string) => { eq: (k: string, v: string) => Promise<{ data: unknown }> };
    delete: () => { eq: (k: string, v: string) => Promise<unknown> };
  };
};

const db = supabaseAdmin as unknown as SessionsTable;

/**
 * Create a session for the user and set the session cookie (for server actions).
 */
export async function createSession(userId: string): Promise<string> {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
  return token;
}

/**
 * Get the current session token from the cookie.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value ?? null;
}

/**
 * Get current user profile from session cookie, or null if not logged in / expired.
 */
export async function getSessionUser(): Promise<UserProfile | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const { data: sessionData } = await db.from('sessions').select('user_id, expires_at').eq('token', token);
  const session = Array.isArray(sessionData) ? sessionData[0] : sessionData;
  if (!session) return null;

  const expiresAt = (session as { expires_at: string }).expires_at;
  if (new Date(expiresAt) <= new Date()) return null;

  const userId = (session as { user_id: string }).user_id;

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('id, email, name, phone, avatar_url, role')
    .eq('id', userId)
    .single();

  if (!userRow) return null;

  const row = userRow as {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: string;
  };

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone ?? null,
    avatarUrl: row.avatar_url ?? null,
    role: row.role as 'customer' | 'retailer' | 'admin',
  };
}

/**
 * Delete session by token and clear the cookie.
 */
export async function destroySession(token: string | null): Promise<void> {
  if (token) {
    await db.from('sessions').delete().eq('token', token);
  }
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
