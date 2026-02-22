'use server';

import { supabaseAdmin } from '@/lib/db/supabase';

export type SubmitContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type SubmitContactResult =
  | { success: true }
  | { success: false; error: string };

export async function submitContact(payload: SubmitContactPayload): Promise<SubmitContactResult> {
  const { name, email, message } = payload;

  if (!name?.trim()) return { success: false, error: 'Name is required' };
  if (!email?.trim()) return { success: false, error: 'Email is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Enter a valid email address' };
  if (!message?.trim()) return { success: false, error: 'Message is required' };

  // contact_inquiries table not in generated Database types
  const { error } = await (supabaseAdmin as any)
    .from('contact_inquiries')
    .insert({
      name: name.trim(),
      email: email.trim(),
      phone: payload.phone?.trim() || null,
      subject: payload.subject?.trim() || null,
      message: message.trim(),
    });

  if (error) {
    console.error('Contact insert error:', error);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }

  return { success: true };
}
