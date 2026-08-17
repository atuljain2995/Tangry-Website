'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AdminLink } from '@/components/admin/AdminLink';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-1 text-sm text-gray-600">
              This admin page failed to load. The data was not changed.
            </p>

            {error.message && (
              <p className="mt-3 break-words rounded-md bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
                {error.message}
              </p>
            )}

            {/* Vercel strips messages in production; the digest is how you find it in the logs. */}
            {error.digest && (
              <p className="mt-2 text-xs text-gray-500">
                Reference: <span className="font-mono">{error.digest}</span>
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
              <AdminLink href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                Back to dashboard
              </AdminLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
