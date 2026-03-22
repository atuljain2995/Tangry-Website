export function AdminEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-4 py-12 text-center text-gray-500">
      <p className="font-medium text-gray-700">{title}</p>
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
    </div>
  );
}
