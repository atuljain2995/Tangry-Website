export function AdminSummaryCard({
  label,
  value,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {footer}
    </div>
  );
}
