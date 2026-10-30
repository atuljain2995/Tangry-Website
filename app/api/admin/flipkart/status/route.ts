import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/user';
import { getFlipkartConfig } from '@/lib/flipkart/config';
import { formatFlipkartError } from '@/lib/flipkart/errors';
import { searchFlipkartListings } from '@/lib/flipkart/listings';

export async function GET() {
  const profile = await requireAdmin();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = getFlipkartConfig();
  if (!config) {
    return NextResponse.json({
      configured: false,
      ok: false,
      message: 'Set FLIPKART_APP_ID and FLIPKART_APP_SECRET',
    });
  }

  try {
    const result = await searchFlipkartListings(config, { batchNo: 0, internalState: 'ACTIVE' });
    return NextResponse.json({
      configured: true,
      ok: true,
      totalListings: result.totalListingsCount ?? 0,
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      ok: false,
      message: formatFlipkartError(err),
    });
  }
}
