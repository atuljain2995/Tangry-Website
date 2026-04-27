import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/db/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        error:
          'Subscriptions are temporarily unavailable. Please try again later or use the contact form.',
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body
      ? String((body as { email: unknown }).email ?? '')
          .trim()
          .toLowerCase()
      : '';

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  // Table exists in DB; generated client types occasionally resolve insert as `never` in this project.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin as any).from('email_subscribers').insert({
    email,
    tags: ['website_newsletter'],
    is_active: true,
  });

  if (error?.code === '23505') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateErr } = await (supabaseAdmin as any)
      .from('email_subscribers')
      .update({ is_active: true, unsubscribed_at: null })
      .eq('email', email);

    if (updateErr) {
      console.error('Newsletter reactivate error:', updateErr);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  if (error) {
    console.error('Newsletter insert error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
