import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';

export default async function AccountOrdersPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-neutral-950">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-neutral-100">My Orders</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-gray-600 dark:text-neutral-300">You don’t have any orders yet.</p>
          <p className="mt-4">
            <Link href="/products" className="text-orange-600 font-medium hover:underline">
              Browse products →
            </Link>
          </p>
        </div>
        <p className="mt-6">
          <Link href="/account" className="text-sm text-gray-600 hover:underline dark:text-neutral-400">
            ← Account
          </Link>
        </p>
      </div>
    </div>
  );
}
