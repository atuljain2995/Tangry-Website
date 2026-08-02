'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { COMPANY_INFO } from '@/lib/data/constants';
import { Package, Mail, Search, Loader2, CheckCircle2, Truck, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getGuestOrders } from '@/lib/utils/guest-orders';
import { ProductImage } from '@/components/ecommerce/ProductImage';

type TrackedOrderItem = {
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  image?: string;
};

type TrackedOrder = {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  currency: string;
  items: TrackedOrderItem[];
  trackingNumber: string | null;
  createdAt: string;
  deliveryCity: string | null;
  deliveryState: string | null;
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function OrderStatusTimeline({ status }: { status: string }) {
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <p className="text-sm font-semibold text-red-700">{STATUS_LABELS[status] ?? status}</p>
    );
  }
  const currentIndex = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex flex-1 items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                i <= currentIndex ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="hidden text-center text-[10px] text-gray-500 sm:block">
              {STATUS_LABELS[step]}
            </span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 ${i < currentIndex ? 'bg-orange-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const STATUS_PILL_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-orange-100 text-orange-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-red-100 text-red-700',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_PILL_STYLES[status] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const GLIMPSE_VISIBLE_LIMIT = 3;

/** Tiny overlapping thumbnail stack so a collapsed order row still hints at what's
 * inside, without adding a line/growing the row's height. */
function OrderItemsGlimpse({ items }: { items: TrackedOrderItem[] }) {
  const visible = items.slice(0, GLIMPSE_VISIBLE_LIMIT);
  const extra = items.length - visible.length;
  const title = items
    .map((i) => `${i.productName}${i.variantName ? ` (${i.variantName})` : ''} \u00d7 ${i.quantity}`)
    .join(', ');

  return (
    <div className="flex shrink-0 -space-x-2" title={title}>
      {visible.map((item, idx) =>
        item.image ? (
          <span
            key={idx}
            className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm"
          >
            <ProductImage src={item.image} alt={item.productName} fill className="object-cover" />
          </span>
        ) : (
          <span
            key={idx}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-[10px] font-bold text-orange-700 shadow-sm"
          >
            {item.productName.charAt(0).toUpperCase()}
          </span>
        ),
      )}
      {extra > 0 && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-600 shadow-sm">
          +{extra}
        </span>
      )}
    </div>
  );
}

function OrderDetailBody({ order }: { order: TrackedOrder }) {
  return (
    <div>
      <OrderStatusTimeline status={order.orderStatus} />

      {order.trackingNumber && (
        <p className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <Truck className="h-4 w-4 text-orange-600" aria-hidden />
          Tracking number: <span className="font-mono">{order.trackingNumber}</span>
        </p>
      )}

      <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100 pt-3">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="text-gray-700">
              {item.productName}
              {item.variantName ? ` (${item.variantName})` : ''} × {item.quantity}
            </span>
            <span className="font-medium text-gray-900">
              {formatMoney(item.price * item.quantity, order.currency)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-bold text-gray-900">
        <span>Total</span>
        <span>{formatMoney(order.total, order.currency)}</span>
      </div>

      {order.deliveryCity && (
        <p className="mt-3 text-xs text-gray-500">
          Delivering to {order.deliveryCity}
          {order.deliveryState ? `, ${order.deliveryState}` : ''}
        </p>
      )}
    </div>
  );
}

function OrderResultCard({ order }: { order: TrackedOrder }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
      <OrderDetailBody order={order} />
    </div>
  );
}

const NAMES_PREVIEW_LIMIT = 2;

/** "Dabeli Masala, Turmeric Powder +2 more" — folded into the existing date line so
 * the row still doesn't grow taller, just wider (and truncates on small screens). */
function itemNamesPreview(items: TrackedOrderItem[]): string {
  const names = items.slice(0, NAMES_PREVIEW_LIMIT).map((i) => i.productName);
  const extra = items.length - names.length;
  return extra > 0 ? `${names.join(', ')} +${extra} more` : names.join(', ');
}

const RECENT_ORDERS_VISIBLE_LIMIT = 5;

/** Compact, expandable row used for the recent-orders list so 5-10+ remembered
 * orders don't turn the page into a wall of full order cards. */
function OrderAccordionRow({
  order,
  expanded,
  onToggle,
}: {
  order: TrackedOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-2 p-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-3"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">#{order.orderNumber}</p>
          <p
            className="truncate text-xs text-gray-500"
            title={order.items
              .map((i) => `${i.productName}${i.variantName ? ` (${i.variantName})` : ''} \u00d7 ${i.quantity}`)
              .join(', ')}
          >
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {' · '}
            {itemNamesPreview(order.items)}
          </p>
        </div>
        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
          <OrderItemsGlimpse items={order.items} />
          <StatusPill status={order.orderStatus} />
          <span className="text-sm font-semibold text-gray-900">
            {formatMoney(order.total, order.currency)}
          </span>
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform sm:ml-0 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 p-4 pt-3">
          <OrderDetailBody order={order} />
        </div>
      )}
    </div>
  );
}

/** Auto-loads orders remembered in localStorage from past guest checkouts on this device —
 * no typing required for the common case of tracking an order just placed. */
function RecentGuestOrders({ onLoaded }: { onLoaded: (hasAny: boolean) => void }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const records = getGuestOrders();
    if (!records.length) {
      setLoading(false);
      onLoaded(false);
      return;
    }

    let cancelled = false;
    Promise.all(
      records
        .slice()
        .reverse()
        .map(async ({ orderNumber, email }) => {
          try {
            const res = await fetch('/api/orders/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderNumber, email }),
            });
            if (!res.ok) return null;
            return (await res.json()) as TrackedOrder;
          } catch {
            return null;
          }
        }),
    ).then((results) => {
      if (cancelled) return;
      const found = results.filter((o): o is TrackedOrder => o !== null);
      setOrders(found);
      setExpandedOrder(found[0]?.orderNumber ?? null);
      setLoading(false);
      onLoaded(found.length > 0);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-center gap-3 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <span className="text-sm">Loading your recent orders…</span>
      </div>
    );
  }

  if (!orders.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="rounded-full bg-orange-100 p-3 text-orange-700">
          <Clock className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Your recent orders</h2>
          <p className="text-gray-600 text-sm">
            Placed from this device — no need to enter details again.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {(showAll ? orders : orders.slice(0, RECENT_ORDERS_VISIBLE_LIMIT)).map((order) => (
          <OrderAccordionRow
            key={order.orderNumber}
            order={order}
            expanded={expandedOrder === order.orderNumber}
            onToggle={() =>
              setExpandedOrder((current) =>
                current === order.orderNumber ? null : order.orderNumber,
              )
            }
          />
        ))}
      </div>
      {!showAll && orders.length > RECENT_ORDERS_VISIBLE_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 text-sm font-semibold text-orange-700 hover:text-orange-800"
        >
          Show {orders.length - RECENT_ORDERS_VISIBLE_LIMIT} more order
          {orders.length - RECENT_ORDERS_VISIBLE_LIMIT === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );
}

function GuestOrderLookup({ collapsedByDefault }: { collapsedByDefault: boolean }) {
  const [expanded, setExpanded] = useState(!collapsedByDefault);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackedOrder | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not find that order.');
        return;
      }
      setResult(data as TrackedOrder);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-left text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-700"
      >
        <Search className="h-5 w-5 text-orange-600" aria-hidden />
        Track a different order number
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-orange-100 p-3 text-orange-700">
          <Search className="h-6 w-6" aria-hidden />
        </div>
        <div className="w-full min-w-0">
          <h2 className="font-bold text-gray-900 mb-2">Track by order number</h2>
          <p className="text-gray-600 text-sm mb-4">
            Enter your order number and the email you used at checkout — works whether or not
            you have an account.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order number (e.g. TAN-XXXXXXX-XXXXX)"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 sm:col-span-2"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used at checkout"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 sm:col-span-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 sm:col-span-2 sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {loading ? 'Searching…' : 'Track order'}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-5">
              <OrderResultCard order={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 'checking' until the recent-orders lookup resolves, so the manual form below
  // doesn't mount (and lock in its collapsed/expanded state) before we know the answer.
  const [recentOrdersState, setRecentOrdersState] = useState<'checking' | 'none' | 'found'>(
    'checking',
  );
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <Header onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-6 py-20 mt-20 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Track your order</h1>
        <p className="text-gray-600 text-center mb-12">
          After checkout we email you updates. Signed-in customers can also view orders anytime.
        </p>

        <div className="space-y-6">
          <RecentGuestOrders
            onLoaded={(hasAny) => setRecentOrdersState(hasAny ? 'found' : 'none')}
          />
          {recentOrdersState !== 'checking' && (
            <GuestOrderLookup collapsedByDefault={recentOrdersState === 'found'} />
          )}

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
              <div className="rounded-full bg-orange-100 p-3 text-orange-700">
                <Package className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Account orders</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Log in with the same email you used at checkout to see status, items, and totals.
                </p>
                <Link
                  href="/account/orders"
                  className="inline-flex font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Go to my orders →
                </Link>
                {!user && (
                  <p className="text-sm text-gray-500 mt-3">
                    No account yet?{' '}
                    <Link
                      href="/signup?redirect=/account/orders"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Create one
                    </Link>{' '}
                    or{' '}
                    <Link
                      href="/login?redirect=/account/orders"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Sign in
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
              <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                <Mail className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Email &amp; support</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Your order confirmation includes details. For tracking help, reply to that email
                  or write to us with your order number.
                </p>
                <a
                  href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent('Order tracking help')}`}
                  className="inline-flex font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500">
          <Link href="/shipping-policy" className="text-orange-600 hover:underline font-medium">
            Shipping policy
          </Link>
          {' · '}
          <Link href="/contact" className="text-orange-600 hover:underline font-medium">
            Contact
          </Link>
        </p>
      </div>

      <Footer />
    </main>
  );
}

