/** Normalize to 10-digit Indian mobile (strips +91 / leading 0). */
export function normalizeIndianMobile(value: string): string | null {
  const digits = value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return digits;
}

export function maskIndianMobile(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 2)}****${phone.slice(-4)}`;
}
