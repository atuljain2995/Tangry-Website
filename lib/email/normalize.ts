/** Lowercase trimmed email for OTP lookup and cookie matching. */
export function normalizeEmail(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.length <= 2 ? local : local.slice(0, 2);
  return `${visible}***@${domain}`;
}
