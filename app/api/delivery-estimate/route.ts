import { NextRequest, NextResponse } from 'next/server';
import {
  lookupPincodeDelivery,
  estimateDeliveryRangeFromPincode,
} from '@/lib/utils/delivery-by-pincode';
import { formatDeliveryDate } from '@/lib/utils/database';

export const dynamic = 'force-dynamic';

/**
 * GET /api/delivery-estimate?pincode=110001
 * Uses India Post public API for locality; returns estimated delivery window (indicative).
 */
export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get('pincode') ?? '';
  const result = await lookupPincodeDelivery(pincode);

  if (!result.ok) {
    const status = result.reason === 'not_found' ? 404 : result.reason === 'invalid' ? 400 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { minDays, maxDays, district, state, areaName, pincode: pc } = result.data;
  const { min, max } = estimateDeliveryRangeFromPincode(minDays, maxDays);
  const arriveBy = max.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return NextResponse.json({
    pincode: pc,
    areaName,
    district,
    state,
    minDays,
    maxDays,
    deliveryText: formatDeliveryDate(min, max),
    arriveBy,
  });
}
