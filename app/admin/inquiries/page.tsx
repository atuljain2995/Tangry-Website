import { getContactInquiriesForAdmin } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminInquiriesPage() {
  const inquiries = await getContactInquiriesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="mt-1 text-sm text-gray-500">Contact form submissions</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {inquiries.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">No inquiries yet.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-500">{inquiry.email}</p>
                      {inquiry.phone && <p className="text-sm text-gray-500">{inquiry.phone}</p>}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(inquiry.created_at)}</p>
                  </div>
                  {inquiry.subject && (
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      Subject: {inquiry.subject}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
