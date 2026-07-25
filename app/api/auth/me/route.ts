import { getSessionUser } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const profile = await getSessionUser();
  if (!profile) {
    // No session is normal for guests — avoid 401 noise in the browser console.
    return NextResponse.json(null);
  }
  return NextResponse.json({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    phone: profile.phone,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
  });
}
