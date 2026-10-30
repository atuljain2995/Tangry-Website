import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminSummaryCard } from '@/components/admin/AdminSummaryCard';
import { AdminTableScroll } from '@/components/admin/AdminTableScroll';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { loadFlipkartAdminSnapshot } from '@/lib/flipkart/admin-data';
import { ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function formatInr(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function pickQuery(searchParams: { q?: string | string[] }) {
  const raw = searchParams.q;
  if (typeof raw === 'string') return raw.trim();
  if (Array.isArray(raw)) return raw[0]?.trim() ?? '';
  return '';
}

export default async function AdminFlipkartPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = pickQuery(sp);
  const snapshot = await loadFlipkartAdminSnapshot(query || undefined);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flipkart seller</h1>
          <p className="mt-1 text-sm text-gray-500">
            Listings and pre-dispatch orders from the Flipkart Seller API (client credentials).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://seller.flipkart.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Seller Hub
            <ExternalLink className="h-4 w-4" />
          </a>
          {snapshot.storefrontUrl ? (
            <a
              href={snapshot.storefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2874f0]/30 bg-[#2874f0]/5 px-3 py-2 text-sm font-medium text-[#2874f0] shadow-sm hover:bg-[#2874f0]/10"
            >
              Storefront
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      {!snapshot.configured ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <h2 className="text-lg font-semibold text-amber-900">API not configured</h2>
          <p className="mt-2">
            Register an application in the Flipkart Seller APIs Developer Admin portal, then add
            these server-only variables to your environment (e.g.{' '}
            <code className="rounded bg-amber-100/80 px-1">.env.local</code>):
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 font-mono text-xs sm:text-sm">
            <li>FLIPKART_APP_ID</li>
            <li>FLIPKART_APP_SECRET</li>
            <li>FLIPKART_API_BASE_URL (optional, defaults to https://api.flipkart.net)</li>
            <li>NEXT_PUBLIC_TANGRY_FLIPKART_URL or FLIPKART_STOREFRONT_URL (store link)</li>
          </ul>
          <p className="mt-3 text-amber-900/80">
            Docs:{' '}
            <a
              className="underline"
              href="https://seller.flipkart.com/api-docs/FMSAPI.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Flipkart Seller API v3
            </a>
          </p>
        </div>
      ) : null}

      {snapshot.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {snapshot.error}
        </div>
      ) : null}

      {snapshot.configured && !snapshot.error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminSummaryCard
              label="Active listings"
              value={snapshot.listings?.total ?? 0}
              footer={
                snapshot.listings && snapshot.listings.rows.length < snapshot.listings.total ? (
                  <span className="mt-2 block text-xs text-gray-500">
                    Showing first {snapshot.listings.rows.length} in table (API batch size 20)
                  </span>
                ) : null
              }
            />
            <AdminSummaryCard
              label="Pre-dispatch shipments"
              value={snapshot.preDispatch?.count ?? 0}
              footer={
                snapshot.preDispatch?.hasMore ? (
                  <span className="mt-2 block text-xs text-gray-500">More results on Flipkart</span>
                ) : null
              }
            />
            <AdminSummaryCard
              label="Connection"
              value="Live"
              footer={
                <span className="mt-2 block text-xs text-gray-500">OAuth client_credentials</span>
              }
            />
          </div>

          <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="font-medium text-gray-700">Search active listings</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="SKU or product name"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              Search
            </button>
            {query ? (
              <a
                href="/admin/flipkart"
                className="rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </a>
            ) : null}
          </form>

          <AdminSectionCard
            title="Active listings"
            description="POST /sellers/listings/v3/product/search — internalState ACTIVE"
          >
            <AdminTableScroll>
              {!snapshot.listings?.rows.length ? (
                <AdminEmptyState
                  title="No listings"
                  description="No active listings matched your criteria."
                />
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        SSP
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        MRP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {snapshot.listings.rows.map((row) => {
                      const key = row.listingId ?? row.sku ?? row.productId ?? row.product_name;
                      const desc = row.product_description;
                      return (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-4 py-3 sm:px-6">
                            <div className="flex items-center gap-3">
                              {row.product_image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={row.product_image_url}
                                  alt=""
                                  className="h-10 w-10 rounded border border-gray-100 object-contain bg-white"
                                />
                              ) : null}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {row.product_name ?? '—'}
                                </p>
                                <p className="text-xs text-gray-500">{row.vertical ?? row.productId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                            {row.sku ?? '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                            <AdminStatusBadge status={row.status ?? 'unknown'} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 sm:px-6">
                            {formatInr(desc?.esp ?? desc?.ssp)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-500 sm:px-6">
                            {formatInr(desc?.mrp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </AdminTableScroll>
          </AdminSectionCard>

          <AdminSectionCard
            title="Pre-dispatch shipments"
            description="Orders to pack or dispatch (NON_FBF, NORMAL shipments)"
          >
            <AdminTableScroll>
              {!snapshot.preDispatch?.rows.length ? (
                <AdminEmptyState
                  title="No pending shipments"
                  description="Nothing in APPROVED / PACKED / READY_TO_DISPATCH for the current filter."
                />
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Shipment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Dispatch by
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Items
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {snapshot.preDispatch.rows.map((shipment) => {
                      const items = shipment.orderItems ?? [];
                      const itemSummary =
                        items.length === 0
                          ? '—'
                          : items
                              .map((i) => `${i.quantity ?? 1}× ${i.sku ?? i.title ?? 'item'}`)
                              .join(', ');
                      return (
                        <tr key={shipment.shipmentId ?? shipment.orderId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm sm:px-6">
                            <p className="font-medium text-gray-900">
                              {shipment.shipmentId ?? shipment.orderId ?? '—'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ordered {formatDate(shipment.orderDate)}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                            <AdminStatusBadge status={shipment.shipmentStatus ?? 'unknown'} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">
                            {formatDate(shipment.dispatchByDate)}
                          </td>
                          <td className="max-w-xs px-4 py-3 text-sm text-gray-600 sm:px-6">
                            {itemSummary}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </AdminTableScroll>
          </AdminSectionCard>
        </>
      ) : null}
    </div>
  );
}
