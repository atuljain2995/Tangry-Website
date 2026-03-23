import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="space-y-8" aria-busy aria-live="polite">
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="h-6 w-6 shrink-0 animate-spin text-orange-600" aria-hidden />
        <p className="text-sm font-medium">Loading admin…</p>
      </div>
      <div className="animate-pulse space-y-8" aria-hidden>
        <div>
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-gray-100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="mt-3 h-8 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-56 rounded bg-gray-100" />
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
