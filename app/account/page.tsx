import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';

export default async function AccountPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <p><span className="text-gray-500">Email:</span> {profile.email}</p>
          {profile.name && <p><span className="text-gray-500">Name:</span> {profile.name}</p>}
          <p><span className="text-gray-500">Role:</span> {profile.role}</p>
        </div>
        <p className="mt-6">
          <Link href="/account/orders" className="text-orange-600 font-medium hover:underline">
            View orders →
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/" className="text-gray-600 text-sm hover:underline">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
