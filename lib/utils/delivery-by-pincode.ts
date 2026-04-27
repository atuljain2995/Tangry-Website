import { validatePinCode } from '@/lib/utils/database';

/** India Post data (api.postalpincode.in) — first office when multiple */
export type PincodeLookupResult = {
  pincode: string;
  district: string;
  state: string;
  areaName: string;
  minDays: number;
  maxDays: number;
};

const NE_STATES = new Set(
  [
    'arunachal pradesh',
    'assam',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'sikkim',
    'tripura',
  ].map((s) => s.toLowerCase()),
);

const REMOTE_STATES = new Set(
  ['jammu and kashmir', 'ladakh', 'andaman and nicobar islands', 'lakshadweep'].map((s) =>
    s.toLowerCase(),
  ),
);

/** Major hubs / well-connected states — typical shorter surface transit */
const FAST_STATES = new Set(
  [
    'delhi',
    'haryana',
    'maharashtra',
    'karnataka',
    'telangana',
    'tamil nadu',
    'west bengal',
    'gujarat',
    'punjab',
    'rajasthan',
    'uttar pradesh',
    'madhya pradesh',
    'bihar',
    'odisha',
    'kerala',
    'andhra pradesh',
    'jharkhand',
    'chhattisgarh',
    'goa',
    'himachal pradesh',
    'uttarakhand',
    'puducherry',
  ].map((s) => s.toLowerCase()),
);

function zoneForState(state: string): 'fast' | 'medium' | 'slow' {
  const s = state.trim().toLowerCase();
  if (REMOTE_STATES.has(s) || NE_STATES.has(s)) return 'slow';
  if (FAST_STATES.has(s)) return 'fast';
  return 'medium';
}

function daysForZone(zone: 'fast' | 'medium' | 'slow'): { minDays: number; maxDays: number } {
  switch (zone) {
    case 'fast':
      return { minDays: 3, maxDays: 6 };
    case 'medium':
      return { minDays: 5, maxDays: 9 };
    case 'slow':
      return { minDays: 7, maxDays: 14 };
    default:
      return { minDays: 5, maxDays: 9 };
  }
}

type PostalApiOffice = {
  Name?: string;
  District?: string;
  State?: string;
};

type PostalApiEntry = {
  Status?: string;
  Message?: string;
  PostOffice?: PostalApiOffice[] | null;
};

/**
 * Resolve PIN code via India Post public API and map state to estimated delivery band.
 */
export async function lookupPincodeDelivery(
  pincode: string,
): Promise<{ ok: true; data: PincodeLookupResult } | { ok: false; error: string }> {
  const pc = pincode.trim();
  if (!validatePinCode(pc)) {
    return { ok: false, error: 'Enter a valid 6-digit PIN code' };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pc}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { ok: false, error: 'Could not verify PIN code. Try again.' };
    }

    const json = (await res.json()) as PostalApiEntry[] | unknown;
    const block = Array.isArray(json) ? json[0] : null;
    if (!block || block.Status !== 'Success' || !block.PostOffice?.length) {
      return { ok: false, error: 'PIN code not found. Check and try again.' };
    }

    const office = block.PostOffice[0];
    const district = (office.District ?? '').trim() || '—';
    const state = (office.State ?? '').trim() || '—';
    const areaName = (office.Name ?? '').trim() || district;

    const zone = zoneForState(state);
    const { minDays, maxDays } = daysForZone(zone);

    return {
      ok: true,
      data: {
        pincode: pc,
        district,
        state,
        areaName,
        minDays,
        maxDays,
      },
    };
  } catch {
    return { ok: false, error: 'Network error. Try again in a moment.' };
  }
}

export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added++;
  }
  return d;
}

export function estimateDeliveryRangeFromPincode(
  minDays: number,
  maxDays: number,
): { min: Date; max: Date } {
  const today = new Date();
  return {
    min: addBusinessDays(today, minDays),
    max: addBusinessDays(today, maxDays),
  };
}
