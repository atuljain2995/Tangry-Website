import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/user';
import { AdminShell } from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();
  if (!profile) redirect('/');

  return <AdminShell profileEmail={profile.email}>{children}</AdminShell>;
}
