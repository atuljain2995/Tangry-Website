'use client';

// Tracks guest-checkout order numbers in localStorage so they can be linked to the
// customer's account (user_id) the next time they sign in on this device.

const STORAGE_KEY = 'tangry_guest_orders';
const MAX_STORED = 20;

type GuestOrderRecord = { orderNumber: string; email: string };

function readAll(): GuestOrderRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: GuestOrderRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_STORED)));
  } catch {
    // localStorage unavailable (private mode / quota) — migration is best-effort, safe to ignore
  }
}

/** Call right after a guest (non-logged-in) checkout completes. */
export function rememberGuestOrder(orderNumber: string, email: string): void {
  if (!orderNumber || !email) return;
  const existing = readAll().filter((r) => r.orderNumber !== orderNumber);
  writeAll([...existing, { orderNumber, email }]);
}

export function getGuestOrders(): GuestOrderRecord[] {
  return readAll();
}

export function removeGuestOrders(orderNumbers: string[]): void {
  if (!orderNumbers.length) return;
  const toRemove = new Set(orderNumbers);
  writeAll(readAll().filter((r) => !toRemove.has(r.orderNumber)));
}

const CHECKOUT_INFO_STORAGE_KEY = 'tangry_guest_checkout_info';

export type GuestCheckoutInfo = {
  email: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

/** Remembers a guest's last-used checkout details so a repeat guest checkout on the
 * same device can skip re-typing the address. Call right after an order succeeds. */
export function rememberGuestCheckoutInfo(info: GuestCheckoutInfo): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHECKOUT_INFO_STORAGE_KEY, JSON.stringify(info));
  } catch {
    // localStorage unavailable (private mode / quota) — best-effort, safe to ignore
  }
}

export function getGuestCheckoutInfo(): GuestCheckoutInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_INFO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as GuestCheckoutInfo) : null;
  } catch {
    return null;
  }
}

