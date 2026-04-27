# Admin Portal Roadmap — Shopify-style

Goal: Make the Tangry admin portal feel like **Shopify Admin** (dashboard, sidebar nav, Orders, Products, Customers, Settings, etc.).

---

## Current state (aligned with codebase)

### Implemented

| Area             | Status        | Notes                                                                                                                                                                                                      |
| ---------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**         | ✅            | Admin-only access via `requireAdmin()` in [`app/admin/layout.tsx`](../app/admin/layout.tsx); non-admins redirect to `/`                                                                                    |
| **Layout**       | ✅            | [`AdminShell.tsx`](../app/admin/AdminShell.tsx) + [`AdminSidebar.tsx`](../app/admin/AdminSidebar.tsx): dashboard, orders, products, customers, discounts, inquiries, settings; mobile drawer               |
| **Dashboard**    | ✅            | [`app/admin/page.tsx`](../app/admin/page.tsx): orders today (revenue), product count, low-stock variant count, recent orders table                                                                         |
| **Orders**       | ✅            | List [`app/admin/orders/page.tsx`](../app/admin/orders/page.tsx), detail + status/tracking [`app/admin/orders/[id]/`](../app/admin/orders/[id]/page.tsx)                                                   |
| **Products**     | ✅            | List, **new** product, **edit** with images + **variants** ([`AdminProductEditForm.tsx`](../app/admin/products/[id]/AdminProductEditForm.tsx))                                                             |
| **Image upload** | ✅            | POST `/api/admin/upload` → [`lib/storage`](../lib/storage) (R2 → Supabase Storage → local fallback). Production needs cloud storage (see [UPDATE_PRODUCTS_AND_IMAGES.md](./UPDATE_PRODUCTS_AND_IMAGES.md)) |
| **Customers**    | ✅            | [`app/admin/customers/page.tsx`](../app/admin/customers/page.tsx)                                                                                                                                          |
| **Discounts**    | ✅            | [`app/admin/discounts/`](../app/admin/discounts/page.tsx) list + new + edit                                                                                                                                |
| **Inquiries**    | ✅            | [`app/admin/inquiries/page.tsx`](../app/admin/inquiries/page.tsx)                                                                                                                                          |
| **Settings**     | ✅            | [`app/admin/settings/page.tsx`](../app/admin/settings/page.tsx)                                                                                                                                            |
| **Reports**      | ✅            | [`app/admin/reports/page.tsx`](../app/admin/reports/page.tsx): sales last 7 / 30 days, top products                                                                                                        |
| **Inventory**    | ✅            | [`app/admin/inventory/page.tsx`](../app/admin/inventory/page.tsx): low-stock variants with links to product edit                                                                                           |
| **Order email**  | ✅ (optional) | When `RESEND_API_KEY` (+ from address) is set, confirmation email after successful COD / verified Razorpay ([`lib/email/order-confirmation.ts`](../lib/email/order-confirmation.ts))                       |
| **UI polish**    | ✅ Baseline   | Shared admin components ([`components/admin/`](../components/admin/)): status badge, empty state, section card, data table shell; [`app/admin/loading.tsx`](../app/admin/loading.tsx) skeleton             |

### Data model

`products`, `product_images`, `product_variants`, `orders`, `users`, `coupons`, `contact_inquiries`, `reviews`, `email_subscribers` (and related migrations under `lib/db/migrations/`).

### Optional / future enhancements

- **Stripe Checkout** — Full session flow for Stripe (checkout currently creates pending orders for non-Razorpay/non-COD paths).
- **Deeper analytics** — Funnels, cohorts, exports (beyond simple sales + top products).
- **Richer CRM** — Per-customer order history page, notes, tags.
- **Newsletter provider** — Wire Brevo/SendGrid for marketing sends (transactional order path uses Resend when configured).

---

## Historical phases (for reference)

Phases 1–5 described the build-out of dashboard, sidebar, orders, products (+ variants), customers, discounts, inquiries, and settings. **That work is implemented** in the paths above.

**Phase 6 — Polish and scale** (original intent):

13. **Inventory at a glance** — Done as [`/admin/inventory`](../app/admin/inventory/page.tsx) (low-stock list).
14. **Reports (simple)** — Done as [`/admin/reports`](../app/admin/reports/page.tsx).
15. **UI consistency** — Partially addressed via shared `components/admin/*` and loading UI; further refinement can continue over time.

---

## Technical notes

- **Queries**: Admin helpers live in [`lib/db/queries.ts`](../lib/db/queries.ts) (e.g. `getOrdersForAdmin`, `getAdminReportsSummary`, `getLowStockVariantsForAdmin`). Uses `supabaseAdmin` where RLS would block.
- **Actions**: Server actions in [`lib/actions/`](../lib/actions/) (e.g. [`orders.ts`](../lib/actions/orders.ts) for `createOrder`, status, tracking).
- **Routes**: Under `app/admin/` as listed above; layout remains the single place for shell + sidebar.

---

## Summary

| Priority | Item                                   | Status            |
| -------- | -------------------------------------- | ----------------- |
| 1        | Dashboard home + sidebar nav           | ✅                |
| 2        | Orders list + detail + status/tracking | ✅                |
| 3        | Add product + variants in edit         | ✅                |
| 4        | Customers list                         | ✅                |
| 5        | Coupons CRUD                           | ✅                |
| 6        | Contact inquiries list                 | ✅                |
| 7        | Settings page (basic)                  | ✅                |
| 8        | Low-stock view + simple reports        | ✅                |
| 9        | UI polish (shared components, loading) | ✅ Baseline       |
| —        | Stripe Checkout / marketing email      | Optional / future |

For day-to-day operations, focus on **production env**: Razorpay keys, **cloud storage** for uploads, analytics IDs, and optionally **Resend** for order confirmations.
