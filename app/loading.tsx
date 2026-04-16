export default function HomeLoading() {
  return (
    <div className="min-h-screen" aria-busy aria-live="polite">
      {/* Hero skeleton */}
      <div className="h-[70vh] w-full animate-pulse bg-gray-200 dark:bg-gray-800" />

      {/* Products skeleton */}
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8 h-8 w-56 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 animate-pulse"
            >
              <div className="aspect-square w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="mt-3 h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
