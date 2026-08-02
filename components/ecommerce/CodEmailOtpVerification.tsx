'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import { maskEmail, normalizeEmail } from '@/lib/email/normalize';

interface CodEmailOtpVerificationProps {
  email: string;
  verified: boolean;
  onVerifiedChange: (verified: boolean) => void;
  disabled?: boolean;
}

export function CodEmailOtpVerification({
  email,
  verified,
  onVerifiedChange,
  disabled = false,
}: CodEmailOtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [checkingTrusted, setCheckingTrusted] = useState(true);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const normalizedEmail = normalizeEmail(email);
  const displayEmail = normalizedEmail ? maskEmail(normalizedEmail) : email;

  // Skip OTP UI when this email was verified on a previous checkout
  useEffect(() => {
    if (verified || !normalizedEmail) {
      setCheckingTrusted(false);
      return;
    }

    let cancelled = false;
    setCheckingTrusted(true);

    fetch('/api/checkout/otp/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: normalizedEmail }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('status check failed'))))
      .then((data: { verified?: boolean }) => {
        if (!cancelled && data.verified) onVerifiedChange(true);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCheckingTrusted(false);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedEmail, verified, onVerifiedChange]);

  const handleSend = async () => {
    if (!normalizedEmail) {
      setError('Enter a valid email on the previous step.');
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await fetch('/api/checkout/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not send verification code');
        return;
      }
      setSent(true);
      setCooldown(60);
    } catch {
      setError('Could not send verification code. Check your connection.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!normalizedEmail) return;
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/checkout/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: normalizedEmail, otp }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }
      onVerifiedChange(true);
    } catch {
      setError('Verification failed. Check your connection.');
    } finally {
      setVerifying(false);
    }
  };

  if (verified) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
          Email verified ({displayEmail})
        </div>
      </div>
    );
  }

  if (checkingTrusted) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Checking email…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
      <div className="mb-3 flex items-start gap-2">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-gray-900">Verify email for Cash on Delivery</p>
          <p className="mt-0.5 text-xs text-gray-600">
            We&apos;ll send a 6-digit code to{' '}
            <span className="font-medium">{displayEmail}</span>
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || sending || cooldown > 0 || !normalizedEmail}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-sm font-semibold text-orange-800 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : sent ? (
            'Resend code'
          ) : (
            'Send code'
          )}
        </button>

        {sent && (
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              disabled={disabled || verifying}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm tracking-widest sm:max-w-[160px]"
              aria-label="Verification code"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={disabled || verifying || otp.length !== 6}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32F2F] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#B71C1C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Verifying…
                </>
              ) : (
                'Verify'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
