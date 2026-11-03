import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, isDatabaseConfigured, schema } from '@/lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
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

  const { emailSubscribers } = schema;
  try {
    const inserted = await getDb()
      .insert(emailSubscribers)
      .values({ email, tags: ['website_newsletter'], is_active: true })
      .onConflictDoNothing({ target: emailSubscribers.email })
      .returning({ id: emailSubscribers.id });

    if (inserted.length === 0) {
      await getDb()
        .update(emailSubscribers)
        .set({ is_active: true, unsubscribed_at: null })
        .where(eq(emailSubscribers.email, email));
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
