export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-6 py-12 mt-20" aria-busy aria-live="polite">
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <div className="mb-6 h-4 w-64 rounded bg-gray-100 dark:bg-gray-800" />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

          {/* Details */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
            <div className="mt-6 h-12 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16">
          <div className="mb-6 h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="aspect-square w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
