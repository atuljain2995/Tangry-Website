'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';

type Result = { type: 'ok' | 'error'; text: string } | null;

export function TelegramTestButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const sendTest = async () => {
    setPending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/notifications/telegram-test', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      setResult(
        data.ok
          ? { type: 'ok', text: 'Test alert sent. Check your Telegram.' }
          : { type: 'error', text: data.error || 'Could not send the test alert.' },
      );
    } catch {
      setResult({ type: 'error', text: 'Request failed. Check your connection and try again.' });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={sendTest}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-[#229ED9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c8cc1] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        Send test alert
      </button>
      {result && (
        <p
          role="status"
          className={`text-sm ${result.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
        >
          {result.text}
        </p>
      )}
    </div>
  );
}
