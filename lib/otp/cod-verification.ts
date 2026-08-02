import crypto from 'crypto';
import { cookies } from 'next/headers';

export const COD_EMAIL_COOKIE = 'tangry_cod_email';
const COOKIE_MAX_AGE_SEC = 30 * 60; // 30 minutes

function getSigningSecret(): string {
  const secret =
    process.env.COD_OTP_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    'tangry-cod-otp-dev-only';
  return secret;
}

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtpCode(code: string): string {
  return crypto.createHash('sha256').update(`${code}:${getSigningSecret()}`).digest('hex');
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

type VerifiedEmailPayload = {
  email: string;
  exp: number;
};

function signPayload(payload: VerifiedEmailPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSigningSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function parseSignedPayload(token: string): VerifiedEmailPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', getSigningSecret()).update(body).digest('base64url');
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as VerifiedEmailPayload;
    if (!payload.email || typeof payload.exp !== 'number') return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createVerifiedEmailCookieValue(email: string): string {
  return signPayload({
    email,
    exp: Date.now() + COOKIE_MAX_AGE_SEC * 1000,
  });
}

export const COD_EMAIL_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: COOKIE_MAX_AGE_SEC,
  path: '/',
};

export async function getVerifiedCodEmailFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COD_EMAIL_COOKIE)?.value;
  if (!raw) return null;
  const payload = parseSignedPayload(raw);
  return payload?.email ?? null;
}

export async function clearVerifiedCodEmailCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COD_EMAIL_COOKIE);
}
