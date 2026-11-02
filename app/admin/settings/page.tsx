import { COMPANY_INFO } from '@/lib/data/constants';
import { RebuildRequestButton } from '@/components/admin/RebuildRequestButton';
import { TelegramTestButton } from '@/components/admin/TelegramTestButton';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  const telegramConfigured = !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Store and app configuration</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Store contact (read-only)</h2>
        <p className="text-sm text-gray-600">
          These values are defined in{' '}
          <code className="rounded bg-gray-100 px-1">lib/data/constants.ts</code>. The registered
          legal name (<code className="rounded bg-gray-100 px-1">legalName</code>) appears on the
          storefront footer only.
        </p>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Brand</dt>
            <dd className="text-gray-900">
              {COMPANY_INFO.brandName} — {COMPANY_INFO.tagline}
            </dd>
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
          To change these, edit the constants file and redeploy. Editable settings (e.g. shipping
          threshold, store name) can be added later with a database-backed settings table.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Order alerts (Telegram)</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              telegramConfigured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {telegramConfigured ? 'Configured' : 'Not configured'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Every completed order (COD or paid online) is sent to your Telegram chat. Send a sample
          alert to check the setup. No order is created.
        </p>
        <TelegramTestButton />
        <p className="text-xs text-gray-500">
          Requires <code className="rounded bg-gray-100 px-1">TELEGRAM_BOT_TOKEN</code> and{' '}
          <code className="rounded bg-gray-100 px-1">TELEGRAM_CHAT_ID</code> in environment
          variables.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Deployment</h2>
        <p className="text-sm text-gray-600">
          Trigger a new Vercel deployment after important admin updates.
        </p>
        <RebuildRequestButton />
        <p className="text-xs text-gray-500">
          Requires <code className="rounded bg-gray-100 px-1">VERCEL_DEPLOY_HOOK_URL</code> in
          environment variables.
        </p>
      </div>
    </div>
  );
}
