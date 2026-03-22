export function AdminTableScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '640px' }}>{children}</div>
    </div>
  );
}
