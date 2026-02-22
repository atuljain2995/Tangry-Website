import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder } from '@/lib/actions/orders';
import type { CreateOrderPayload } from '@/lib/actions/orders';

const keySecret = process.env.RAZORPAY_KEY_SECRET;

function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!keySecret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');
  return expected === signature;
}

export async function POST(request: NextRequest) {
  if (!keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      createOrderPayload,
    } = body;

    if (!orderId || !paymentId || !signature || !createOrderPayload) {
      return NextResponse.json(
        { error: 'Missing payment details or order payload' },
        { status: 400 }
      );
    }

    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const result = await createOrder({
      ...(createOrderPayload as CreateOrderPayload),
      paymentMethod: 'razorpay',
      paymentId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      orderNumber: result.orderNumber,
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
