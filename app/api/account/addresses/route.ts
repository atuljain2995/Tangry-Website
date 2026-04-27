import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('addresses')
    .select(
      'id, type, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default',
    )
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data ?? []);
}
