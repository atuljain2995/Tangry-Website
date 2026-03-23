import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { getAddressesForUser } from '@/lib/db/queries';
import { AccountSettingsClient } from '@/components/account/AccountSettingsClient';

export default async function AccountPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const addresses = await getAddressesForUser(profile.id);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            ← Store
          </Link>
        </div>
        <AccountSettingsClient profile={profile} addresses={addresses} />
      </div>
    </div>
  );
}
