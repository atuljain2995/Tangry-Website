'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { safeRedirectPath } from '@/lib/utils/safe-redirect';
import { analytics } from '@/lib/analytics';

function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(searchParams.get('redirect'), '/');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined, redirect }),
        credentials: 'include',
        redirect: 'manual',
      });
      if (res.type === 'opaqueredirect' || res.status === 302) {
        const location = res.headers.get('Location') || redirect;
        window.location.href = location;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not create account');
        analytics.trackAuth('signup_failed');
        setLoading(false);
        return;
      }
      analytics.trackAuth('signup_success');
      window.location.href = redirect;
    } catch {
      setError('Something went wrong');
      analytics.trackAuth('signup_failed');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Create account
          </h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-neutral-400">
            Sign up with your email and a password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-600 text-white font-semibold py-2.5 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link
              href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-orange-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
          <div className="text-gray-500 dark:text-neutral-400">Loading…</div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
