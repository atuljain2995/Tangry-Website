import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { getAddressesForUser } from '@/lib/db/queries';
import { AddressesClient } from './AddressesClient';

export default async function AddressesPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  const addresses = await getAddressesForUser(profile.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-neutral-100">
        Saved Addresses
      </h1>
      <AddressesClient addresses={addresses} />
    </div>
  );
}
