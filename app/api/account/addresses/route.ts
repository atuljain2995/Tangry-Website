import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { getAddressesForUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await getAddressesForUser(user.id));
}
