import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { sendTelegramOrderAlert } from '@/lib/notifications/telegram';

export async function POST() {
  const session = await getSessionUser();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await sendTelegramOrderAlert(
    {
      orderNumber: 'TEST-0001',
      total: 390,
      paymentMethod: 'cod',
      email: 'test@example.com',
      shippingAddress: {
        id: 'test',
        userId: 'test',
        fullName: 'Test Customer',
        phone: '9999999999',
        addressLine1: 'Test address',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302012',
        country: 'IN',
        type: 'shipping',
        isDefault: false,
      },
      items: [
        { productName: 'Pav Bhaji Masala', variantName: '100 g', quantity: 2, price: 135 },
        { productName: 'Chai Masala', variantName: '50 g', quantity: 1, price: 120 },
      ],
    },
    { test: true },
  );

  return result.ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false, error: result.error }, { status: 502 });
}
