import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/user';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();
  if (!profile) redirect('/');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/admin/products" className="text-lg font-semibold text-gray-800">
            Tangry Admin
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-orange-600"
          >
            ← Back to store
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
