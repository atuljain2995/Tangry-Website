import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';

export default async function AccountOrdersPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600">You don’t have any orders yet.</p>
          <p className="mt-4">
            <Link href="/products" className="text-orange-600 font-medium hover:underline">
              Browse products →
            </Link>
          </p>
        </div>
        <p className="mt-6">
          <Link href="/account" className="text-gray-600 text-sm hover:underline">← Account</Link>
        </p>
      </div>
    </div>
  );
}
