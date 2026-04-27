'use server';

import bcrypt from 'bcrypt';
import { createSession, getSessionToken, destroySession } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';

const SALT_ROUNDS = 10;

type UsersTable = {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => Promise<{ data: unknown }> };
    insert: (r: object) => {
      select: (c: string) => { single: () => Promise<{ data: unknown; error: unknown }> };
    };
  };
};

const db = supabaseAdmin as unknown as UsersTable;

export type SignInResult = { success: true } | { success: false; error: string };
export type SignUpResult = { success: true } | { success: false; error: string };

/**
 * Sign in with email and password. Creates session and sets cookie.
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password)
    return { success: false, error: 'Email and password required' };

  const { data: rows } = await db
    .from('users')
    .select('id, email, password_hash')
    .eq('email', normalizedEmail);
  const user = Array.isArray(rows) ? rows[0] : rows;
  if (!user) return { success: false, error: 'Invalid email or password' };

  const passwordHash = (user as { password_hash: string | null }).password_hash;
  if (!passwordHash) return { success: false, error: 'Invalid email or password' };

  const match = await bcrypt.compare(password, passwordHash);
  if (!match) return { success: false, error: 'Invalid email or password' };

  await createSession((user as { id: string }).id);
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

  const { data: existing } = await db.from('users').select('id').eq('email', normalizedEmail);
  if (Array.isArray(existing) && existing.length > 0) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { data: newUser, error } = await db
    .from('users')
    .insert({
      email: normalizedEmail,
      name: name?.trim() || null,
      password_hash: passwordHash,
      role: 'customer',
    })
    .select('id')
    .single();

  if (error) {
    console.error('SignUp insert error:', error);
    return { success: false, error: 'Could not create account. Try again.' };
  }

  const userId =
    newUser && typeof newUser === 'object' && 'id' in newUser
      ? (newUser as { id: string }).id
      : null;
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
