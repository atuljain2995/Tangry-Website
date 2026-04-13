'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/data/constants';
import { analytics } from '@/lib/analytics';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean; alreadySubscribed?: boolean };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setEmail('');
      analytics.trackFormSubmission('newsletter', true);
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — we'll keep sending you Tangry updates."
          : "Thanks! You're subscribed. Watch your inbox for offers and spice tips."
      );
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <section className="bg-orange-50 py-16 dark:bg-neutral-900/80">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl border-4 border-orange-100 bg-white p-8 shadow-xl md:p-12 dark:border-orange-900/40 dark:bg-neutral-900 dark:shadow-black/20">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold tracking-wider text-orange-700 uppercase dark:bg-orange-950/60 dark:text-orange-300">
              <Mail size={14} /> Stay Updated
            </div>
            <h2 className="mb-3 text-3xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-neutral-100">
              Join The Spice Squad
            </h2>
            <p className="font-medium text-gray-600 dark:text-neutral-300">
              Get offers and spice tips by email. Follow{' '}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-700 font-semibold hover:underline"
              >
                @tangryspices
              </a>{' '}
              for recipes and behind-the-scenes from Jaipur.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            noValidate
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error' || status === 'success') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-orange-900/50"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-gray-900 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-60 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-600 underline-offset-2 hover:text-orange-600 hover:underline dark:text-neutral-400 dark:hover:text-orange-400"
            >
              Prefer the contact form?
            </Link>
          </div>

          {message && (
            <p
              className={`text-center text-sm mt-4 font-medium ${
                status === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-700 dark:text-green-400'
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm font-medium text-gray-500 dark:text-neutral-400">
            We respect your inbox — no spam, only Tangry updates you can use.
          </p>
        </div>
      </div>
    </section>
  );
};
