import { getSessionUser } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const profile = await getSessionUser();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
