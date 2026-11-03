import crypto from 'crypto';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
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

  await getDb().insert(schema.sessions).values({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  return token;
}

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

  const { sessions, users } = schema;
  const [row] = await getDb()
    .select({
      expires_at: sessions.expires_at,
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      avatar_url: users.avatar_url,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.user_id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!row || new Date(row.expires_at) <= new Date()) return null;
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
    await getDb().delete(schema.sessions).where(eq(schema.sessions.token, token));
  }
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
