export default function AccountLoading() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-12 mt-20" aria-busy aria-live="polite">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 w-full rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
