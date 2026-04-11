export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-6 py-12" aria-busy aria-live="polite">
      <div className="animate-pulse">
        <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full rounded bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
