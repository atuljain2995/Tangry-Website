'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/data/constants';

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
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border-4 border-orange-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
              <Mail size={14} /> Stay Updated
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
              Join The Spice Squad
            </h2>
            <p className="text-gray-600 font-medium">
              Get offers and spice tips by email. Follow{' '}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold hover:underline"
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
              className="flex-1 min-w-0 rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-600 hover:text-orange-600 underline-offset-2 hover:underline"
            >
              Prefer the contact form?
            </Link>
          </div>

          {message && (
            <p
              className={`text-center text-sm mt-4 font-medium ${
                status === 'error' ? 'text-red-600' : 'text-green-700'
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            We respect your inbox — no spam, only Tangry updates you can use.
          </p>
        </div>
      </div>
    </section>
  );
};
