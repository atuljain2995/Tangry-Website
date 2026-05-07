# SEO Action Plan — Tangry Spices
**URL:** https://www.tangryspices.com  
**Generated:** 7 May 2026  
**Overall Score:** 61/100

---

## Priority Legend

| Priority | Fix Within | Impact |
|---|---|---|
| 🔴 Critical | Immediately (this week) | Blocks indexing, revenue loss, or compliance risk |
| 🟠 High | Within 1–2 weeks | Significant ranking or visibility impact |
| 🟡 Medium | Within 1 month | Meaningful optimization opportunity |
| 🟢 Low | Backlog | Nice-to-have improvement |

---

## 🔴 CRITICAL — Fix Immediately

### C1. Unblock Google-Extended and GPTBot in robots.txt
**File:** `public/robots.txt` or the file served at `/robots.txt`  
**Effort:** 15 minutes  
**Impact:** Enables site to appear in Google AI Overviews and ChatGPT search. Currently 100% invisible to AI search experiences.

**Current state:**
```
User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /
```

**Target state:**
```
# AI-generated search answers (Google AI Overviews, ChatGPT) — ALLOW
User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

# AI training crawlers — keep blocked
User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /
```

You can retain `Content-Signal: ai-train=no` as a rights assertion. The distinction is:
- `Google-Extended` = powers AI Overviews (search answer summaries) — **allow**
- `GPTBot` = powers ChatGPT real-time browsing — **allow**
- `CCBot`, `Bytespider` = training crawlers — **keep blocked**

---

### C2. Remove `Disallow: /_next/` from generic crawlers
**File:** `public/robots.txt`  
**Effort:** 10 minutes  
**Impact:** Allows all crawlers to fetch CSS/JS assets needed for accurate rendering

**Current state (problematic block):**
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /checkout/
Disallow: /admin/
Disallow: /_next/       ← REMOVE THIS LINE
Disallow: /private/
```

The `Disallow: /_next/` line prevents non-Googlebot crawlers from loading Next.js bundles. Googlebot gets a separate clean block, but third-party SEO tools and other search engines cannot render the site.

---

### C3. Add product photography to all product listings
**File:** Database (product images column)  
**Effort:** Ongoing (photography), 1 hour (database update)  
**Impact:** Required for Product rich results in Google, Google Shopping eligibility, visual search, and conversion rate

Affected products (currently using `logo-512.png` as fallback image):
- Chai Masala
- Pav Bhaji Masala  
- (verify all 15 products)

**Quick fix for immediate schema compliance:** For any product without a real photo, use a high-quality styled flat-lay image. Never use the brand logo as a product image.

**Database update:** Set `images` array in the products table to include at least one real product image URL per product.

---

### C4. Create a Privacy Policy page
**File:** Create `app/privacy-policy/page.tsx` + `app/privacy-policy/layout.tsx`  
**Effort:** 2 hours  
**Impact:** Required for GDPR/IT Act compliance, Google Analytics data collection, email newsletter sign-ups, and Google Shopping trust requirements

**Minimum required sections:**
- What data is collected (email, purchase data, cookies)
- How data is used (order processing, newsletter, analytics)
- Cookies disclosure (GA4, Microsoft Clarity, Vercel Analytics)
- Contact for data requests
- Last updated date

**Add to footer:** Link "Privacy Policy" in the HELP or COMPANY column.

---

### C5. Fix geo coordinate inconsistency
**File:** `lib/utils/schema.ts` (LocalBusiness schema) AND `app/about/page.tsx` (Google Maps link)  
**Effort:** 30 minutes  
**Impact:** Affects Google Maps match confidence and local Knowledge Panel

Current disagreement:
- About page Google Maps link: `26.9124, 75.7873`
- Schema `geo` coordinates: `26.935058, 75.757109`

**Action:** Open Google Maps, navigate to "A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara, Jaipur 302012", right-click → copy coordinates. Use one consistent set everywhere.

---

## 🟠 HIGH — Fix Within 1–2 Weeks

### H1. Add all product and blog URLs to the sitemap
**File:** `app/sitemap.ts`  
**Effort:** 2 hours  
**Impact:** Google can only discover and index pages listed in the sitemap or linked from indexed pages. 15 product pages and 6 blog posts are currently not in the sitemap.

**Current implementation** appears to statically list only top-level pages. Refactor to dynamically include:
- All product slugs from the database
- All blog post slugs from `lib/data/blog.ts`
- `/about/founder`
- `/recipes`
- Remove `/search` (crawler trap)

**Example addition to `app/sitemap.ts`:**
```typescript
// Add product pages
const products = await getProducts(); // your existing DB query
const productUrls = products.map((p) => ({
  url: `https://www.tangryspices.com/products/${p.slug}`,
  lastModified: p.updatedAt,
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));

// Add blog posts
const blogUrls = blogPosts.map((post) => ({
  url: `https://www.tangryspices.com/blog/${post.slug}`,
  lastModified: new Date(post.updated),
  changeFrequency: 'monthly' as const,
  priority: 0.6,
}));
```

---

### H2. Fix LocalBusiness schema type
**File:** `lib/utils/schema.ts`, function `getLocalBusinessSchema()`  
**Effort:** 10 minutes  
**Impact:** Correct classification for Google Maps local categories and rich results

```typescript
// BEFORE
'@type': ['LocalBusiness', 'FoodEstablishment'],

// AFTER
'@type': ['LocalBusiness', 'FoodStore'],
```

`FoodEstablishment` is for restaurants and cafes. `FoodStore` is the correct type for a retail spice shop/manufacturer.

---

### H3. Add ItemList schema to the Products listing page
**File:** `app/products/page.tsx` or `ProductsPageClient.tsx`  
**Effort:** 1 hour  
**Impact:** Eligible for product list rich results and carousel in Google SERPs

Add a schema generator in `lib/utils/schema.ts`:
```typescript
export function getItemListSchema(products: ProductExtended[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tangry Spices Product Catalog',
    url: 'https://www.tangryspices.com/products',
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.tangryspices.com/products/${p.slug}`,
      name: p.name,
    })),
  };
}
```

---

### H4. Create a dedicated Returns/Refund Policy page
**File:** Create `app/returns/page.tsx`  
**Effort:** 1.5 hours  
**Impact:** Consumer trust, Google Shopping eligibility, reduces cart abandonment from uncertain buyers

Document the 7-day return policy mentioned in trust badges with full terms: conditions for returns, process, who bears shipping costs, refund timeline.

**Add to footer:** Link "Returns & Refunds" in the HELP column.

---

### H5. Improve product page titles
**File:** Product database (metaTitle field) or product page metadata  
**Effort:** 1 hour (update all 15 products)  
**Impact:** Improved CTR from SERPs; currently titles are too short

**Template:** `Buy [Product Name] ([Weight]) Online – Tangry Spices, Jaipur`

Examples:
- Before: `Chai Masala | Tangry Spices`
- After: `Buy Chai Masala (50g) Online – Tangry Spices, Jaipur`

- Before: `Pav Bhaji Masala | Tangry Spices`
- After: `Buy Pav Bhaji Masala (100g) Online – Tangry Spices, Jaipur | FSSAI Licensed`

---

### H6. Add ArticleSchema to blog posts
**File:** `app/blog/[slug]/page.tsx`  
**Effort:** 1 hour  
**Impact:** Blog articles eligible for Article rich results and Top Stories carousel

Add to `lib/utils/schema.ts`:
```typescript
export function getBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://www.tangryspices.com${post.image}`,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      '@type': 'Organization',
      name: 'Tangry Spices',
      url: 'https://www.tangryspices.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tangry Spices',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tangryspices.com/images/logo-512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.tangryspices.com/blog/${post.slug}`,
    },
  };
}
```

---

### H7. Standardize NAP across all pages and schema
**Files:** `lib/data/constants.ts`, `lib/utils/schema.ts`, `app/about/page.tsx`, footer  
**Effort:** 1 hour  
**Impact:** Local SEO trust signals; NAP consistency is a core ranking factor for local results

Choose one canonical format and apply everywhere:

| Field | Standard Format |
|---|---|
| Address | A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara, Jaipur 302012, Rajasthan, India |
| Phone | +91 77330 09952 (consistent spacing) |
| Email | tangryspices@gmail.com |
| Business Name | Tangry Spices (use consistently; avoid "Tangry" alone in some places) |

---

## 🟡 MEDIUM — Fix Within 1 Month

### M1. Upgrade blog email address to branded domain
**Current:** tangryspices@gmail.com  
**Recommended:** hello@tangryspices.com or info@tangryspices.com  
**Effort:** 1 day (DNS setup via Cloudflare Email Routing or Zoho Mail free tier)  
**Impact:** Professional credibility, especially important for B2B/wholesale inquiries

---

### M2. Add FAQ schema to product pages and category pages
**File:** Product page template + `lib/utils/schema.ts`  
`getFAQSchema` already exists in the codebase. Deploy it with relevant Q&A pairs per product (e.g., "Is this masala spicy?", "What is the shelf life?", "Is it suitable for Jain diet?").

**Impact:** FAQ rich results can double SERP real estate for product queries.

---

### M3. Fix H1 tags on Products and Blog listing pages
**Files:**
- `app/products/page.tsx` — change H1 from "SHOP TANGRY" to "Buy Spices & Masalas Online — Tangry, Jaipur"
- `app/blog/page.tsx` — change H1 from "SPICE STORIES" to "Indian Spice Stories — Recipes, Tips & Guides"
- Fix CSS to not rely on `text-transform: uppercase` applied via class — use proper display text in a `<span aria-hidden>` if visual uppercase is needed

---

### M4. Add blog post author pages and expert attribution
**Files:** `lib/data/blog.ts`, blog post template  
**Effort:** 3 hours  
**Impact:** Improves E-E-A-T signals; Google values identified authors in food/health content

Create a `/about/team` or `/about/founder` link from each blog post. Replace "Tangry Team" with "Maya Jain" (founder) or another identified author. Add a short author bio section under each post.

---

### M5. Expand product descriptions with ingredient lists
**File:** Database (product descriptions)  
**Effort:** 2 hours per product  
**Impact:** Transparency for consumers, FSSAI packaging compliance signals, longer content improves keyword coverage

Add to each product page: full ingredient list, net weight, shelf life, storage instructions, allergen information. This is standard for food products and expected by health-conscious buyers.

---

### M6. Add image sitemap entries for product pages
**File:** `app/sitemap.ts`  
**Effort:** 1.5 hours  
**Impact:** Google Image Search and Google Shopping discovery

```typescript
// In sitemap products array
images: product.images.map((img) => ({
  url: toAbsoluteUrl(img),
  caption: product.name,
  title: product.name,
})),
```

---

### M7. Add `hasOfferCatalog` to Organization schema
**File:** `lib/utils/schema.ts`  
**Effort:** 30 minutes  
**Impact:** Enriches Knowledge Panel with product offering signals

```typescript
hasOfferCatalog: {
  '@type': 'OfferCatalog',
  name: 'Tangry Spices Catalog',
  url: 'https://www.tangryspices.com/products',
  numberOfItems: 15,
},
```

---

### M8. Add `last-updated` date to Shipping Policy page
**File:** `app/shipping-policy/page.tsx`  
**Effort:** 10 minutes  
**Impact:** Trust signal; required by consumer protection best practices  
The shipping policy page renders "Last updated for customers shopping on this site" without an actual date. Add the real last-updated date.

---

### M9. Resolve duplicate URL patterns for categories
**Investigation needed:** `/products?category=X` vs `/categories/[slug]` both appear to serve category-filtered products. Determine if they render the same content. If so:
- Set canonical on `/products?category=X` pointing to `/categories/[slug]`
- Or consolidate to one URL pattern

---

### M10. Load analytics scripts with Next/Script `lazyOnload` strategy
**File:** `components/analytics/GoogleAnalytics.tsx`, `MicrosoftClarity.tsx`  
**Effort:** 30 minutes  
**Impact:** Reduces main-thread blocking, improves INP and LCP

```typescript
// Use Next/Script with strategy
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="lazyOnload"
/>
```

---

## 🟢 LOW — Backlog

### L1. Add blog posts to llms.txt
Add blog post URLs and excerpts to `public/llms.txt` so AI assistants can discover authoritative Tangry content about Indian spices.

### L2. Create a dedicated FAQ page
A standalone `/faq` page covering shipping, returns, FSSAI certification, ingredients, wholesale process, etc. High value for both long-tail keyword coverage and AI citability.

### L3. Add recipe links to product pages
Link the Recipes page content to specific products. E.g., "Pav Bhaji recipe" on the Pav Bhaji Masala product page. Creates internal link equity and richer product pages.

### L4. Claim and optimize Google Business Profile
Search "Tangry Spices Jaipur" — claim the GBP listing, add photos of the production unit, add product catalog, enable messaging. High impact for local discovery.

### L5. Add Flipkart product links to product pages
The homepage links to a generic Flipkart search (`/search?q=tangry+spices`). If specific product listings exist on Flipkart/Amazon, link directly from each product page. This also creates a sameAs signal for the Organization schema.

### L6. Implement Review Request Flow
After order delivery, send an automated email requesting a product review. Even 1-2 reviews per product will unlock AggregateRating rich results in Google. Consider incentivizing with a discount code.

### L7. Add `@id` cross-references between Organization and LocalBusiness schemas
Link the two sitewide schemas together:
```typescript
// In Organization schema
'sameAs': ['https://www.tangryspices.com/#local-business', ...socialLinks]

// In LocalBusiness schema (already has @id set)
'@id': 'https://www.tangryspices.com/#local-business'
```

### L8. Set `priority` on hero image in Next/Image
Verify that the primary hero image on the homepage and product pages uses `priority={true}` prop in the `<Image>` component to trigger preloading and improve LCP.

### L9. Replace Recipes page with real recipe content
The current recipes page has hardcoded placeholder recipes (generic dishes not tied to Tangry products). Either remove it from navigation or replace with actual recipes that reference specific Tangry masalas. Currently, this page provides no SEO value and may be a thin content signal.

### L10. Add Terms of Service page
Create `/terms` page covering purchase terms, intellectual property, and site usage. Required for completeness of legal documentation.

---

## Summary Roadmap

### Week 1 (Critical fixes)
- [ ] C1: Unblock Google-Extended and GPTBot
- [ ] C2: Remove `/_next/` from generic crawlers
- [ ] C3: Add product images to all products (photography sprint)
- [ ] C4: Create Privacy Policy page
- [ ] C5: Fix geo coordinates

### Week 2 (High-impact)
- [ ] H1: Add products + blog to sitemap
- [ ] H2: Fix LocalBusiness schema type
- [ ] H3: Add ItemList schema to /products
- [ ] H4: Create Returns Policy page
- [ ] H5: Improve product title tags
- [ ] H6: Add Article schema to blog posts
- [ ] H7: Standardize NAP everywhere

### Month 1 (Medium optimizations)
- [ ] M1–M10 in priority order

### Backlog (ongoing)
- [ ] L1–L10 as capacity allows

---

## Expected Score After Critical + High Fixes

| Category | Current | After C+H Fixes | Delta |
|---|---|---|---|
| Technical SEO | 58 | 75 | +17 |
| Content Quality | 62 | 65 | +3 |
| On-Page SEO | 72 | 80 | +8 |
| Schema / Structured Data | 70 | 84 | +14 |
| Performance (CWV) | 55 | 60 | +5 |
| AI Search Readiness | 28 | 72 | +44 |
| Images | 45 | 65 | +20 |
| **Overall** | **61** | **~75** | **+14** |
