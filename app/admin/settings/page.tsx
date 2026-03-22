import { COMPANY_INFO } from '@/lib/data/constants';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Store and app configuration</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Store contact (read-only)</h2>
        <p className="text-sm text-gray-600">These values are defined in <code className="rounded bg-gray-100 px-1">lib/data/constants.ts</code>.</p>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Brand</dt>
            <dd className="text-gray-900">
              {COMPANY_INFO.brandName} — {COMPANY_INFO.tagline}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Legal name</dt>
            <dd className="text-gray-900">{COMPANY_INFO.legalName}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Phone</dt>
            <dd className="text-gray-900">{COMPANY_INFO.phone}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email</dt>
            <dd className="text-gray-900">{COMPANY_INFO.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Wholesale email</dt>
            <dd className="text-gray-900">{COMPANY_INFO.wholesaleEmail}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Address</dt>
            <dd className="text-gray-900">{COMPANY_INFO.address}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Certifications</dt>
            <dd className="text-gray-900">{COMPANY_INFO.certifications.join(' · ')}</dd>
          </div>
        </dl>
        <p className="pt-2 text-sm text-gray-500">
          To change these, edit the constants file and redeploy. Editable settings (e.g. shipping threshold, store name) can be added later with a database-backed settings table.
        </p>
      </div>
    </div>
  );
}
