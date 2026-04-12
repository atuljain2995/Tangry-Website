import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';
import { sendOrderConfirmationEmail } from '@/lib/email/order-confirmation';

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const orderId = body?.orderId;
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('order_number, user_email, total, currency, items')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (!order.user_email) {
    return NextResponse.json({ error: 'No email on this order' }, { status: 400 });
  }

  const items = (order.items as { productName: string; variantName?: string; quantity: number; price: number }[]) ?? [];

  await sendOrderConfirmationEmail({
    to: order.user_email,
    orderNumber: order.order_number,
    total: order.total,
    currency: order.currency ?? 'INR',
    items,
  });

  return NextResponse.json({ success: true });
}
