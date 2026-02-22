import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const amountInPaise = Math.round(Number(body.amountInPaise) || 0);
    if (amountInPaise <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcp_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      keyId,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
