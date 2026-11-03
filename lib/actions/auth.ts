'use server';

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSession, getSessionToken, destroySession } from '@/lib/auth/session';
import { getDb, schema } from '@/lib/db';

const SALT_ROUNDS = 10;
const { users } = schema;

export type SignInResult = { success: true } | { success: false; error: string };
export type SignUpResult = { success: true } | { success: false; error: string };

/**
 * Sign in with email and password. Creates session and sets cookie.
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password)
    return { success: false, error: 'Email and password required' };

  const [user] = await getDb()
    .select({ id: users.id, password_hash: users.password_hash })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);
  if (!user?.password_hash) return { success: false, error: 'Invalid email or password' };

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return { success: false, error: 'Invalid email or password' };

  await createSession(user.id);
  return { success: true };
}

/**
 * Sign up: create user with hashed password, then create session.
 */
export async function signUp(
  email: string,
  password: string,
  name?: string | null,
): Promise<SignUpResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password)
    return { success: false, error: 'Email and password required' };
  if (password.length < 6)
    return { success: false, error: 'Password must be at least 6 characters' };

  const db = getDb();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);
  if (existing.length > 0) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let userId: string | undefined;
  try {
    [{ id: userId }] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name: name?.trim() || null,
        password_hash: passwordHash,
        role: 'customer',
      })
      .returning({ id: users.id });
  } catch (error) {
    console.error('SignUp insert error:', error);
    return { success: false, error: 'Could not create account. Try again.' };
  }
  if (!userId) return { success: false, error: 'Could not create account. Try again.' };

  await createSession(userId);
  return { success: true };
}

/**
 * Sign out: destroy session and clear cookie.
 */
export async function signOut(): Promise<void> {
  const token = await getSessionToken();
  await destroySession(token);
}
