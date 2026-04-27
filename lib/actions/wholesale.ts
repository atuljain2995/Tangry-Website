'use server';

import { supabaseAdmin } from '@/lib/db/supabase';

export type SubmitWholesalePayload = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber?: string;
  businessType?: string;
  estimatedMonthlyVolume?: string;
  message?: string;
};

export type SubmitWholesaleResult = { success: true } | { success: false; error: string };

export async function submitWholesaleQuote(
  payload: SubmitWholesalePayload,
): Promise<SubmitWholesaleResult> {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    gstNumber,
    businessType,
    estimatedMonthlyVolume,
    message,
  } = payload;

  if (!companyName?.trim()) return { success: false, error: 'Company name is required' };
  if (!contactPerson?.trim()) return { success: false, error: 'Contact person is required' };
  if (!email?.trim()) return { success: false, error: 'Email is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Enter a valid email address' };
  if (!phone?.trim()) return { success: false, error: 'Phone is required' };
  if (!/^[6-9]\d{9}$/.test(phone.trim()))
    return { success: false, error: 'Enter a valid 10-digit Indian mobile number' };
  if (
    gstNumber?.trim() &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      gstNumber.trim().toUpperCase(),
    )
  ) {
    return { success: false, error: 'Enter a valid GST number (e.g. 08ABCDE1234F1Z5)' };
  }

  const messageParts = [message?.trim()].filter(Boolean);
  if (businessType?.trim()) messageParts.unshift(`Business type: ${businessType.trim()}.`);
  if (estimatedMonthlyVolume?.trim())
    messageParts.unshift(`Estimated monthly volume: ${estimatedMonthlyVolume.trim()}.`);
  const fullMessage = messageParts.reverse().join(' ').trim() || null;

  // b2b_quotes may not be in generated Database types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin as any).from('b2b_quotes').insert({
    user_id: null,
    company_name: companyName.trim(),
    gst_number: gstNumber?.trim().toUpperCase() || null,
    contact_person: contactPerson.trim(),
    email: email.trim(),
    phone: phone.trim(),
    items: [],
    message: fullMessage,
    status: 'pending',
  });

  if (error) {
    console.error('B2B quote insert error:', error);
    return { success: false, error: 'Failed to submit inquiry. Please try again.' };
  }

  return { success: true };
}
