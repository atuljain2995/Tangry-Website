import { getSessionUser } from '@/lib/auth/session';

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: 'customer' | 'retailer' | 'admin';
};

/**
 * Get current user's profile from session (in-house auth).
 * Returns null if not signed in or session expired.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  return getSessionUser();
}

/**
 * Require admin role. Returns profile if admin, null otherwise. Use in admin layout to redirect.
 */
export async function requireAdmin(): Promise<UserProfile | null> {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') return null;
  return profile;
}
