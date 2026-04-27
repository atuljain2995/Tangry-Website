import { getCWVSummaryForAdmin, CWV_THRESHOLDS } from '@/lib/db/queries';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminSummaryCard } from '@/components/admin/AdminSummaryCard';

export const dynamic = 'force-dynamic';

// ── Thresholds ────────────────────────────────────────────────────────────────
const METRIC_UNITS: Record<string, string> = {
  LCP: 'ms',
  INP: 'ms',
  CLS: '',
  FCP: 'ms',
  TTFB: 'ms',
};

const METRIC_LABEL: Record<string, string> = {
  LCP: 'Largest Contentful Paint',
  INP: 'Interaction to Next Paint',
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  TTFB: 'Time to First Byte',
};

function formatValue(name: string, value: number) {
  if (name === 'CLS') return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

function ratingColor(name: string, p75: number) {
  const t = CWV_THRESHOLDS[name];
  if (!t) return 'text-gray-600';
  if (p75 <= t.good) return 'text-green-600';
  if (p75 <= t.poor) return 'text-amber-500';
  return 'text-red-600';
}

function ratingBadge(name: string, p75: number) {
  const t = CWV_THRESHOLDS[name];
  if (!t) return null;
  if (p75 <= t.good)
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        Good
      </span>
    );
  if (p75 <= t.poor)
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Needs Improvement
      </span>
    );
  return (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
      Poor
    </span>
  );
}

// ── Aggregate across all URLs for summary cards ────────────────────────────
function buildSitewideP75(rows: Awaited<ReturnType<typeof getCWVSummaryForAdmin>>) {
  const allByMetric: Record<string, number[]> = {};
  for (const row of rows) {
    for (const m of row.metrics) {
      if (!allByMetric[m.metricName]) allByMetric[m.metricName] = [];
      // Approximate: use p75 per URL weighted equally (fast, no raw values needed)
      allByMetric[m.metricName].push(m.p75);
    }
  }
  const result: Record<string, number> = {};
  for (const [metric, vals] of Object.entries(allByMetric)) {
    const sorted = [...vals].sort((a, b) => a - b);
    const idx = Math.min(Math.ceil(0.75 * sorted.length) - 1, sorted.length - 1);
    result[metric] = sorted[idx] ?? 0;
  }
  return result;
}

export default async function AdminPerformancePage() {
  const rows = await getCWVSummaryForAdmin(28);
  const sitewide = buildSitewideP75(rows);
  const coreMetrics = ['LCP', 'INP', 'CLS'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Core Web Vitals</h1>
        <p className="mt-1 text-sm text-gray-500">
          First-party RUM — P75 from real page loads over the last 28 days. No PSI or CrUX API
          dependency.
        </p>
      </div>

      {/* Sitewide P75 summary */}
      {Object.keys(sitewide).length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map((metric) => {
            const p75 = sitewide[metric];
            if (p75 === undefined) return null;
            return (
              <AdminSummaryCard
                key={metric}
                label={metric}
                value={
                  <span className={ratingColor(metric, p75)}>
                    {formatValue(metric, p75)}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      {METRIC_UNITS[metric]}
                    </span>
                  </span>
                }
                footer={
                  <div className="mt-2 flex items-center gap-1.5">
                    {ratingBadge(metric, p75)}
                    <span className="text-xs text-gray-400">sitewide P75</span>
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      {/* Per-URL breakdown */}
      <AdminSectionCard
        title="Per-page breakdown"
        description="P75 values per URL. Core Web Vitals: LCP, INP, CLS."
      >
        {rows.length === 0 ? (
          <AdminEmptyState
            title="No CWV data yet"
            description="Data will appear here as real users visit pages. Each page load beacons LCP, INP, CLS, FCP, and TTFB automatically."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:px-6">
                    Page
                  </th>
                  {coreMetrics.map((m) => (
                    <th
                      key={m}
                      className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider text-xs"
                    >
                      {m}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider text-xs">
                    FCP
                  </th>
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider text-xs">
                    TTFB
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Samples
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Last seen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map(({ url, metrics }) => {
                  const byName = Object.fromEntries(metrics.map((m) => [m.metricName, m]));
                  const maxSamples = Math.max(...metrics.map((m) => m.sampleCount), 0);
                  const lastSeen = metrics.reduce(
                    (max, m) => (m.lastSeen > max ? m.lastSeen : max),
                    metrics[0]?.lastSeen ?? new Date(0),
                  );

                  return (
                    <tr key={url} className="hover:bg-gray-50">
                      <td className="px-4 py-3 sm:px-6">
                        <span className="font-mono text-xs text-gray-700 break-all">{url}</span>
                      </td>
                      {['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map((metric) => {
                        const m = byName[metric];
                        return (
                          <td key={metric} className="px-3 py-3 text-center">
                            {m ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={`font-semibold ${ratingColor(metric, m.p75)}`}>
                                  {formatValue(metric, m.p75)}
                                </span>
                                {ratingBadge(metric, m.p75)}
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-right text-gray-500 tabular-nums">
                        {maxSamples}
                      </td>
                      <td className="px-3 py-3 text-right text-gray-400 text-xs">
                        {lastSeen.getTime() > 0
                          ? lastSeen.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>

      {/* Thresholds reference */}
      <AdminSectionCard title="Thresholds reference" description="Google CWV pass/fail criteria">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Metric', 'Full name', 'Good', 'Needs Improvement', 'Poor'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs sm:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {Object.entries(CWV_THRESHOLDS).map(([metric, t]) => (
                <tr key={metric} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold sm:px-6">{metric}</td>
                  <td className="px-4 py-3 text-gray-500 sm:px-6">{METRIC_LABEL[metric]}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    ≤ {metric === 'CLS' ? t.good : `${t.good} ms`}
                  </td>
                  <td className="px-4 py-3 text-amber-600 font-medium">
                    {metric === 'CLS' ? `${t.good}–${t.poor}` : `${t.good}–${t.poor} ms`}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-medium">
                    &gt; {metric === 'CLS' ? t.poor : `${t.poor} ms`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSectionCard>
    </div>
  );
}
