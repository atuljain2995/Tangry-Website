import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/user';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="container mx-auto max-w-6xl px-4 py-6 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <AccountSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
