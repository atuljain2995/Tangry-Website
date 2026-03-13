# Admin Portal Roadmap — Shopify-style

Goal: Make the Tangry admin portal feel like **Shopify Admin** (dashboard, sidebar nav, Orders, Products, Customers, Settings, etc.).

---

## Current state

### What you have

| Area | Status | Notes |
|------|--------|--------|
| **Auth** | ✅ | Admin-only access via `requireAdmin()`, middleware protects `/admin` |
| **Layout** | ⚠️ Minimal | Top bar with "Tangry Admin" + "Back to store" only. No sidebar, no dashboard home |
| **Products** | ✅ Solid | List view + edit by ID. Name, description, category, meta, flags (featured/new/best seller), multiple images with upload |
| **Image upload** | ✅ | POST `/api/admin/upload` → saves to `public/products/`, URL stored in DB |
| **Data model** | ✅ | `products`, `product_images`, `product_variants`, `orders`, `users`, `coupons`, `contact_inquiries`, `reviews`, `email_subscribers` |

### What’s missing (vs Shopify-style)

1. **No admin home/dashboard** — `/admin` redirects or 404; no overview (recent orders, revenue, low stock, etc.).
2. **No sidebar navigation** — Single link to Products in the header; no Orders, Customers, Analytics, Settings, etc.
3. **No Orders management** — Orders exist in DB and checkout creates them, but no admin UI to list, filter, or update status (e.g. mark as shipped, add tracking).
4. **No Customers/Users view** — No list of users, roles, or basic profile management.
5. **No product creation** — Only edit existing products; no "Add product" flow (with variants, price, SKU, stock).
6. **No variants in admin** — Variants (price, SKU, stock) live in DB and store uses them, but admin product edit doesn’t show or edit variants.
7. **No discounts/coupons UI** — Coupons table exists and is used at checkout; no admin CRUD for coupons.
8. **No inventory/stock UI** — No way to see or update variant stock (e.g. low-stock alerts, bulk edit).
9. **No contact/inquiries inbox** — `contact_inquiries` table exists; no admin page to view or reply.
10. **No reports/analytics** — No sales over time, top products, or simple reports.
11. **No settings** — No admin UI for store name, shipping rules, tax, or basic config (even if stored in env/DB later).
12. **UI polish** — No consistent card-based layout, empty states, or loading skeletons like Shopify.

---

## Recommended next steps (in order)

### Phase 1 — Structure and navigation (Shopify-like shell)

1. **Admin dashboard home** (`/admin`)
   - Redirect `/admin` to `/admin` (or a dedicated dashboard route).
   - Dashboard page: greeting, short summary cards (e.g. “Orders today”, “Total products”, “Low stock count”), and “Recent orders” list (last 5–10).
   - Requires: one or two new queries (e.g. `getOrdersForAdmin(limit)`, `getProductsCount`, `getLowStockVariantsCount`).

2. **Sidebar navigation**
   - Add a persistent left sidebar in `app/admin/layout.tsx` with:
     - Dashboard (home)
     - Orders
     - Products (existing list)
     - Customers (or “Users”)
     - Discounts (coupons)
     - Content / Contact inquiries (optional)
     - Settings (optional placeholder)
   - Use icons (e.g. Lucide) and active state for current route. Collapsible on small screens (drawer/hamburger) if you want.

3. **Header tweaks**
   - Keep “Tangry Admin” and “Back to store”. Optionally add search (e.g. products/orders) and admin user name/avatar later.

### Phase 2 — Orders

4. **Orders list** (`/admin/orders`)
   - Table: order number, date, customer email, total, status, payment status.
   - Filters: date range, status (pending, confirmed, shipped, etc.).
   - Click row or “View” → order detail page.

5. **Order detail** (`/admin/orders/[id]`)
   - Show full order (items, addresses, payment method, status).
   - Actions: “Mark as confirmed”, “Mark as shipped” (with optional tracking number), “Cancel”, “Refund” (can start as “Mark as refunded” only).
   - Persist status/tracking in `orders` (you already have `order_status`, `tracking_number`, etc.).

### Phase 3 — Products (closer to Shopify)

6. **Add product** (`/admin/products/new`)
   - Form: name, description, category, slug (auto from name or editable), meta, featured/new/best seller.
   - At least one image (reuse existing upload + `product_images`).
   - On submit: create row in `products`, then create default variant (or redirect to “Add variants” step). Reuse existing variant schema (name, SKU, price, compare_at_price, stock, etc.).

7. **Variants in product edit**
   - On existing `/admin/products/[id]` page, add a “Variants” section: list of variants (name, SKU, price, compare at price, stock, available).
   - Inline edit or small modal: add variant, edit, delete. Call existing or new server actions that update `product_variants`.

8. **Product list improvements**
   - Optional: search by name, filter by category, sort by name/date. “Add product” button that goes to `/admin/products/new`.

### Phase 4 — Customers and marketing

9. **Customers** (`/admin/customers`)
   - List users (from `users` table) with email, name, role, created date. Optional: order count per user (aggregate from `orders`).
   - No need for full CRM; a simple table and maybe a detail view (orders by this user) is enough for a Shopify-like feel.

10. **Discounts** (`/admin/discounts` or `/admin/coupons`)
    - List coupons (code, type, value, usage, valid range, active).
    - Add / Edit / Deactivate. Form fields map to your `coupons` table (code, discount_type, discount_value, min_order_value, valid_from, valid_until, is_active, etc.).

### Phase 5 — Content and settings

11. **Contact inquiries** (`/admin/inquiries` or under “Content”)
    - List rows from `contact_inquiries` (date, name, email, subject, message). View detail; optional “Mark as read” or “Replied” if you add a column later.

12. **Settings** (`/admin/settings`)
    - Placeholder or simple form: store name, support email, WhatsApp (you already use this), maybe shipping threshold (e.g. “Free shipping above ₹499”). Can store in DB (`settings` table) or keep in env and only show copy/help text.

### Phase 6 — Polish and scale

13. **Inventory at a glance**
    - On dashboard or a dedicated “Inventory” view: products/variants with low stock (e.g. stock &lt; 10). Link to product edit.

14. **Reports (simple)**
    - “Sales last 7/30 days” (sum of `orders.total` where status not cancelled), “Top 5 products” by quantity sold (from order items JSONB). Simple charts or tables.

15. **UI consistency**
    - Reuse a small set of components: `Card`, `DataTable`, `Badge` (for status), `Button` (primary/secondary), empty states, loading skeletons. Makes the admin feel cohesive like Shopify.

---

## Technical notes

- **Queries**: Add admin-only functions in `lib/db/queries.ts` (e.g. `getOrdersForAdmin`, `getOrderByIdForAdmin`, `getUsersForAdmin`, `getCouponsForAdmin`, `getContactInquiries`). Use `supabaseAdmin` so RLS doesn’t block.
- **Actions**: New server actions under `lib/actions/` for orders (e.g. `updateOrderStatus`, `setTrackingNumber`), coupons (CRUD), and product create/variant update.
- **Routes**: `app/admin/page.tsx` (dashboard), `app/admin/orders/page.tsx` and `app/admin/orders/[id]/page.tsx`, `app/admin/customers/page.tsx`, `app/admin/discounts/page.tsx`, `app/admin/inquiries/page.tsx`, `app/admin/settings/page.tsx`, and `app/admin/products/new/page.tsx`. Layout stays the single place for sidebar + header.
- **Variants**: Product create can insert one default variant; full variant CRUD in product edit reuses `product_variants` and your existing checkout/cart logic.

---

## Summary

| Priority | Item | Effort |
|----------|------|--------|
| 1 | Dashboard home + sidebar nav | Small |
| 2 | Orders list + detail + status/tracking | Medium |
| 3 | Add product + variants in edit | Medium |
| 4 | Customers list | Small |
| 5 | Coupons CRUD | Small |
| 6 | Contact inquiries list | Small |
| 7 | Settings page (basic) | Small |
| 8 | Low-stock view + simple reports | Medium |
| 9 | UI polish (cards, tables, empty states) | Ongoing |

Starting with **Phase 1 (dashboard + sidebar)** and **Phase 2 (Orders)** will give the biggest “Shopify admin” feel quickly; then add product creation and variant editing, then customers, discounts, and the rest.
