'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

const COOLDOWN_STORAGE_KEY = 'adminRebuildCooldownUntil';

type Result =
  | { type: 'ok'; text: string }
  | { type: 'error'; text: string }
  | null;

export function RebuildRequestButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [now, setNow] = useState(Date.now());

  const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

  useEffect(() => {
    const raw = window.localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) {
      window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      return;
    }
    if (parsed > Date.now()) {
      setCooldownUntil(parsed);
      setNow(Date.now());
      return;
    }
    window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  useEffect(() => {
    if (cooldownRemaining === 0 && cooldownUntil > 0) {
      setCooldownUntil(0);
      window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    }
  }, [cooldownRemaining, cooldownUntil]);

  const setCooldown = (seconds: number) => {
    const until = Date.now() + seconds * 1000;
    setCooldownUntil(until);
    setNow(Date.now());
    window.localStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
  };

  const requestRebuild = async () => {
    if (cooldownRemaining > 0) {
      setResult({ type: 'error', text: `Please wait ${cooldownRemaining}s before trying again.` });
      return;
    }

    const confirmed = window.confirm(
      'Trigger a new Vercel deployment now? This will start a fresh production build.',
    );
    if (!confirmed) return;

    setPending(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/rebuild', {
        method: 'POST',
        credentials: 'include',
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        retryAfter?: number;
        cooldownSeconds?: number;
      };

      if (!res.ok) {
        if (data.retryAfter) {
          setCooldown(data.retryAfter);
        }
        setResult({
          type: 'error',
          text: data.error || `Request failed with status ${res.status}`,
        });
        return;
      }

      setCooldown(data.cooldownSeconds ?? 45);

      setResult({ type: 'ok', text: data.message || 'Rebuild requested successfully.' });
    } catch (error) {
      setResult({
        type: 'error',
        text: error instanceof Error ? error.message : 'Request failed',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={requestRebuild}
        disabled={pending || cooldownRemaining > 0}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        {pending
          ? 'Requesting rebuild...'
          : cooldownRemaining > 0
            ? `Cooldown ${cooldownRemaining}s`
            : 'Request Vercel Rebuild'}
      </button>

      {result && (
        <p
          className={`text-sm ${
            result.type === 'ok' ? 'text-green-700' : 'text-red-700'
          }`}
          role="status"
        >
          {result.text}
        </p>
      )}
    </div>
  );
}
