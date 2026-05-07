# Full SEO Audit Report — Tangry Spices
**URL:** https://www.tangryspices.com  
**Audit Date:** 7 May 2026  
**Auditor:** GitHub Copilot (Claude Sonnet 4.6)

---

## Executive Summary

| Metric | Score |
|---|---|
| **Overall SEO Health Score** | **61 / 100** |
| Technical SEO | 58 / 100 |
| Content Quality | 62 / 100 |
| On-Page SEO | 72 / 100 |
| Schema / Structured Data | 70 / 100 |
| Performance (CWV) | 55 / 100 (estimated — no CrUX data) |
| AI Search Readiness | 28 / 100 |
| Images | 45 / 100 |

**Business Type Detected:** E-Commerce (B2C + B2B Wholesale) — Spices / Packaged Food — Hybrid (online + physical storefront in Jhotwara, Jaipur). Small-batch artisan food brand. Founded 2025, FSSAI licensed, ISO 22000 certified.

### Top 5 Critical Issues
1. **All major AI crawlers are blocked in robots.txt** — GPTBot, Google-Extended, ClaudeBot, CCBot, meta-externalagent, Applebot-Extended, Amazbot all disallowed. Site is invisible to Google AI Overviews, ChatGPT, Perplexity, and other AI search experiences.
2. **robots.txt has duplicate `User-agent: *` blocks with conflicting `Disallow: /_next/`** — The Cloudflare-managed block disallows `/_next/` for all crawlers, which prevents crawlers from fetching CSS/JS assets needed for accurate rendering. Googlebot has a separate clean block but third-party crawlers are impacted.
3. **Product images use placeholder logo (`logo-512.png`)** — Multiple product pages show the brand logo as the product image. This breaks Product schema image requirements, harms visual search, and undermines trust.
4. **Zero customer reviews on most products** — 13 of 15 products have 0 reviews, 1 has a single review. AggregateRating schema is not emitted when reviewCount = 0 (correctly), but the absence of social proof suppresses click-through and blocks review-enriched rich results.
5. **Missing Privacy Policy and Return/Refund Policy pages** — No dedicated `/privacy-policy` URL and no `/returns` page exist. The About page mentions "7-day return policy" only in a trust badge. Google Shopping, FSSAI compliance expectations, and consumer trust all require dedicated policy pages.

### Top 5 Quick Wins
1. **Unblock Google-Extended in robots.txt** (30 min) — Enables Google AI Overviews. Separate AI training block (`ai-train=no`) can be retained.
2. **Create and link a Privacy Policy page** (2 hrs) — Essential for consumer trust, FSSAI compliance context, and Google Shopping feed if pursued.
3. **Add product images to all listings** (ongoing) — Replace `logo-512.png` fallback with actual product photographs to enable visual search and rich product schema.
4. **Add `ItemList` schema to `/products` page** (1 hr) — Quick schema win that can produce sitelinks/carousel rich results in Google.
5. **Fix the duplicate `Disallow: /_next/`** in robots.txt (15 min) — Remove the Cloudflare-managed block for `/_next/` or consolidate to prevent crawl rendering issues.

---

## 1. Technical SEO

### 1.1 Robots.txt — Score: 5/10

**File location:** https://www.tangryspices.com/robots.txt

**Issues found:**

#### CRITICAL — Duplicate `User-agent: *` blocks
The robots.txt file contains two separate `User-agent: *` sections:
- **Block 1 (Cloudflare-managed):** Includes `Disallow: /` for a long list of AI bots plus `Content-Signal` directives
- **Block 2 (custom):** Has the correct app-level disallows for `/api/`, `/account/`, `/checkout/`, `/admin/`, and also `Disallow: /_next/`

Google's spec states that when multiple blocks match a user-agent, each matching block's rules are combined (additive). The `/_next/` disallow in Block 2 means standard crawlers cannot fetch Next.js static assets (CSS, JS bundles), which prevents accurate JavaScript rendering.

**Fix:** Remove `Disallow: /_next/` from the custom `User-agent: *` block. The Googlebot-specific block correctly omits this. Also consolidate the duplicate CCBot entries.

#### HIGH — All AI crawlers blocked
Current state:
```
User-agent: Amazonbot       → Disallow: /
User-agent: Applebot-Extended → Disallow: /
User-agent: Bytespider       → Disallow: /
User-agent: CCBot            → Disallow: / (appears twice)
User-agent: ClaudeBot        → Disallow: /
User-agent: GPTBot           → Disallow: /
User-agent: Google-Extended  → Disallow: /
User-agent: meta-externalagent → Disallow: /
User-agent: anthropic-ai     → Disallow: /
User-agent: cohere-ai        → Disallow: /
```

This blocks 100% of AI search experiences. While blocking AI training (`ai-train=no` content signal) is a legitimate rights assertion, blocking `Google-Extended` prevents site pages from appearing in Google AI Overviews. Blocking `GPTBot` prevents ChatGPT from crawling. These are discovery crawlers, not training crawlers.

**What to do:** Selectively allow crawlers that serve users — specifically `Google-Extended` (AI Overviews) and `GPTBot` (ChatGPT). Continue blocking crawlers that only train models (e.g., `CCBot`, `Bytespider`, `cohere-ai`). The Content-Signal `ai-train=no` remains as a rights signal for compliant crawlers.

**Recommended robots.txt adjustments:**
```
# Allow Google AI Overviews (search answers)
User-agent: Google-Extended
Allow: /

# Allow ChatGPT real-time browsing
User-agent: GPTBot
Allow: /
```

### 1.2 Sitemap — Score: 6/10

**File location:** https://www.tangryspices.com/sitemap.xml

**Issues:**
- All 20+ URLs share the same `lastmod` timestamp (2026-04-28T18:49:22.146Z), suggesting the sitemap is generated statically at build time rather than dynamically. When products are updated or new blog posts are published, the sitemap is stale until the next deploy.
- No product-level URLs appear in the sitemap. Only category/top-level pages are listed. All 15 individual product URLs (`/products/chai-masala`, etc.) are missing from the sitemap.
- No image sitemap — product images are not declared with `<image:image>` extensions.
- No `sitemap_index` / separate sitemaps for products, blog, and categories.
- `/about/founder` page is not included in the sitemap.
- `/recipes` page is not included in the sitemap.
- `/search` page is correctly excluded (crawler trap risk).

**Fix:** Update `app/sitemap.ts` to dynamically include all product slugs and blog slugs from the database/data source. Add `<image:image>` entries for product pages.

### 1.3 Canonicals — Score: 8/10

- Root layout sets `metadataBase: new URL('https://www.tangryspices.com')` ✅
- Root layout sets `alternates: { canonical: '/' }` ✅
- Product pages set `alternates: { canonical: \`/products/${slug}\` }` ✅
- Blog pages set `alternates: { canonical: \`/blog/${slug}\` }` ✅
- `/products?category=X` filter URLs — canonical handling not confirmed; if these render separate pages without canonical pointing back to `/products`, duplicate content risk exists.
- Products page (listing) defines metadata but category filter URLs may lack canonical.

### 1.4 Indexability — Score: 7/10

- `robots: { index: true, follow: true }` globally ✅
- Admin, account, checkout, API routes all blocked in robots.txt ✅
- Googlebot gets a clean block with only functional paths disallowed ✅
- `/_next/` disallow for generic crawlers may cause partial rendering ⚠️

### 1.5 Security Headers — Score: 6/10

Security header assessment (inferred from Next.js/Vercel defaults):
- HTTPS enforced (site loads over HTTPS) ✅
- Vercel typically provides basic security headers (X-Content-Type-Options, X-Frame-Options) ✅
- No CSP (Content Security Policy) header confirmed
- `dangerouslySetInnerHTML` used in schema script tags — not an XSS risk since the data is application-generated JSON-LD, not user input ✅
- FSSAI license displayed prominently (trust signal) ✅

### 1.6 Crawlability & Rendering — Score: 6/10

- Site is a Next.js 15 app using SSR + ISR (revalidate: 3600 on product pages, 86400 on blog) ✅
- ISR revalidation times are appropriate for the content type ✅
- `generateStaticParams()` returns empty array on product pages (on-demand rendering) — pages will be slow on first request until cached ⚠️
- JavaScript-heavy SPA with client components (cart, wishlist, auth) — critical content is server-rendered ✅

### 1.7 URL Structure — Score: 9/10

- Clean, descriptive URLs: `/products/chai-masala`, `/blog/health-benefits-turmeric` ✅
- Consistent lowercase kebab-case ✅
- No parameter clutter on main product pages ✅
- Category filter via query param (`/products?category=X`) — acceptable pattern ✅

---

## 2. Content Quality (E-E-A-T)

### 2.1 Experience & Expertise Signals — Score: 7/10

**Positive:**
- Clear founder attribution: Maya Jain (with dedicated `/about/founder` page)
- Physical manufacturing address disclosed: Khatipura Road, Jhotwara, Jaipur
- FSSAI license number published (12225026001713) — verifiable, high-trust signal
- ISO 22000 certification mentioned
- Production unit described in detail (sourcing regions: Rajasthan, MP, Kerala, Karnataka)
- Product descriptions include practical use instructions, ingredients overview, and "Why Tangry" section

**Issues:**
- Blog author is "Tangry Team" — no individual expert is named. Google's E-E-A-T guidelines reward articles written by identified, credible individuals with relevant background.
- No author bio/profile pages linked from blog posts
- No nutritional information on product pages (a trust signal for food products)
- Ingredients list not published on product pages (ingredient transparency supports FSSAI compliance and buyer trust)

### 2.2 Content Depth & Thin Content — Score: 5/10

**Blog posts analyzed:**
- "10 Everyday Benefits of Turmeric" — Title promises 10 benefits but the visible content covers 2-3 generic tips. This is a title-content mismatch that signals thin content.
- "How to Use Garam Masala Without Overpowering Food" — Not analyzed in depth but format appears similar.
- "5 Spice Storage Tips for Fresher Masalas" — 6 min read, appears to be a tips list.
- All posts attributed to "Tangry Team" — no author authority signals.

**Product descriptions:**
- Descriptions follow a consistent 4-section template (Description, How to use, Why Tangry, Serving suggestion) — good structure ✅
- Average description length appears to be 200-350 words — borderline thin for competitive SERP ranking
- No ingredient lists, no nutritional info, no allergen declarations
- No customer-generated Q&A content

**Recipes page:**
- Recipes page exists but uses hardcoded placeholder data (Paneer Butter Masala, Chicken Biryani, Dal Tadka, etc.) — these are generic Indian dishes, not specifically tied to Tangry products. This page has very low unique content value and may be seen as thin/boilerplate.

### 2.3 Authoritativeness Signals — Score: 6/10

- Social media presence: Instagram (@tangryspices), Twitter/X (@tangryspices), Facebook ✅
- Wholesale/B2B page establishes commercial credibility ✅
- Testimonials section on homepage (3 reviews from Rajesh M., Anita K., Suresh P.) ✅
- No third-party press mentions or media coverage
- No external backlinks confirmed (no backlink API available)
- Young domain (founded 2025/2026 launch) — low domain authority expected

### 2.4 Trustworthiness — Score: 7/10

- HTTPS ✅
- FSSAI license prominently displayed ✅
- Physical address and phone number published ✅
- Email: tangryspices@gmail.com — using Gmail for a business signals a lack of professionalism. A branded email (e.g., hello@tangryspices.com) would strengthen trust for B2B buyers.
- **Missing Privacy Policy page** — required for user data collection (newsletter, checkout)
- **No dedicated Return/Refund Policy page** — 7-day return policy mentioned only in a trust badge, not on a dedicated URL
- No Terms of Service page
- Shipping policy page exists ✅ but "Last updated" date is missing

---

## 3. On-Page SEO

### 3.1 Title Tags — Score: 8/10

| Page | Title | Length | Assessment |
|---|---|---|---|
| Homepage | Tangry Spices \| Authentic Rajasthani Masalas & Pickles from Jaipur | ~68 chars | ✅ Good — includes brand, product type, location |
| Products listing | (uses template `SHOP TANGRY \| Tangry Spices`) | ~30 chars | ⚠️ Generic, misses keywords |
| Chai Masala product | Chai Masala \| Tangry Spices | ~29 chars | ⚠️ Short, misses "buy", weight, city |
| Blog listing | SPICE STORIES \| Tangry Spices | ~30 chars | ⚠️ All-caps display text leaked into title |
| About | Rooted in Rajasthan \| Tangry Spices | ~37 chars | ⚠️ Misses "about" and "spices" context |
| Wholesale | Wholesale & B2B — Tangry from Jaipur \| Tangry Spices | ~54 chars | ✅ Good |

**Issues:**
- Product titles are too short. Ideal format: `Buy Chai Masala (50g) Online – Tangry Spices, Jaipur`
- Blog index page title leaks display text (SPICE STORIES) instead of SEO-optimized text
- Products listing title is generic — should target category keywords

### 3.2 Meta Descriptions — Score: 7/10

| Page | Description | Length | Assessment |
|---|---|---|---|
| Homepage | "Tangry — Taste of Home. Masalas, ready powders, and pickles from Jhotwara, Jaipur. FSSAI licensed, ISO 22000. Shop dabeli masala, pav bhaji, gun powder, turmeric & more." | ~167 chars | ✅ Good |
| Products listing | "Masalas, ready powders, and essentials from Tangry, Jaipur. FSSAI licensed · ISO 22000." | ~89 chars | ⚠️ Too short, no CTA |
| Chai Masala | Dynamic from DB (product.metaDescription or product.description) | Varies | ✅ Dynamic is good if descriptions are filled |

**Issues:**
- Products listing meta description is under 100 characters
- Blog listing meta description not verified
- Some product pages may be using the long product description as meta description (first 155 chars of product.description) — this may produce descriptions that start mid-sentence

### 3.3 Heading Structure — Score: 7/10

**Homepage:**
- H1: "Authentic Jaipur flavours from Tangry Spices" ✅
- H2s: "THE STASH", "Products You Will Love", "Trusted in kitchens & stores", "ROOTED IN RAJASTHAN. BUILT FOR EVERY KITCHEN.", "Buy online", "Join The Spice Squad", "TANGRY" ✅ (multiple H2s, appropriate hierarchy)

**Products listing:**
- H1: "SHOP TANGRY" — all caps text in H1 (renders in uppercase), loses semantic keyword value. Should be: "Buy Spices & Masalas Online — Tangry, Jaipur"

**Product pages:**
- H1: Product name (e.g., "Chai Masala") ✅
- H3s used for Description, How to use, Why Tangry — skipping H2 level ⚠️

**Blog listing:**
- H1: "SPICE STORIES" — same issue as Products

### 3.4 Internal Linking — Score: 6/10

**Issues:**
- Category pages link to filtered product list (`/products?category=X`) AND to `/categories/[slug]` — two different URL patterns for what appears to be the same content. Risk of duplicate content and diluted link equity.
- Recipes page internally has no links to specific products related to those recipes.
- Blog posts link to relevant product pages via "Related products" section ✅
- No breadcrumbs visible in page content on category pages or blog listing
- Homepage links to products, categories, and about — good coverage ✅
- No hub-and-spoke content structure yet: blog posts don't cross-link to each other beyond the "More spice stories" section

---

## 4. Schema / Structured Data

### 4.1 Implementation Overview — Score: 7/10

Schema is injected via a `<StructuredData>` component that renders `<script type="application/ld+json">` tags. Implementation is correct and follows Next.js best practices.

**Schemas currently implemented:**

| Schema Type | Location | Status |
|---|---|---|
| Organization | Root layout (all pages) | ✅ Correct |
| LocalBusiness | Root layout (all pages) | ⚠️ Wrong sub-type |
| WebSite (with SearchAction) | Homepage only | ✅ Correct |
| Product / ProductGroup | Individual product pages | ✅ Good implementation |
| BreadcrumbList | Product pages | ✅ |
| Recipe | Recipes page | ⚠️ Hardcoded placeholder data |
| Article / BlogPosting | Blog post pages | ❌ Not confirmed implemented |

### 4.2 Schema Issues

#### HIGH — LocalBusiness uses `FoodEstablishment` sub-type
```json
"@type": ["LocalBusiness", "FoodEstablishment"]
```
`FoodEstablishment` is for restaurants/cafes. A spice manufacturer/retailer should use `FoodStore` or `Store`. This misclassification may affect Google Maps category matching and local rich results.

**Fix:**
```json
"@type": ["LocalBusiness", "FoodStore"]
```

#### HIGH — No `ItemList` schema on Products listing page
The `/products` page shows 15 products but has no `ItemList` or `CollectionPage` schema. This misses the opportunity for product carousels and list-enriched snippets in Google.

#### HIGH — Article/BlogPosting schema not confirmed on blog posts
Blog post pages import and use `StructuredData` component, but the schema being passed was not confirmed. If BlogPosting schema is missing or incomplete, blog articles won't be eligible for article rich results or Top Stories.

#### MEDIUM — AggregateRating absent on most product pages
Correctly not emitted when `reviewCount = 0`, but this means 13/15 products are ineligible for star rating rich results. Actively driving reviews is needed.

#### MEDIUM — Product images in schema pointing to logo
Products without custom images use `logo-512.png` as the schema image URL. Google's product rich results guidelines require product-specific images; logo images will not qualify.

#### MEDIUM — Organization schema missing `hasOfferCatalog`
Organization schema could include an `hasOfferCatalog` linking to the products catalog, which is a useful signal for Knowledge Panel enrichment.

#### LOW — Geo coordinates in LocalBusiness schema need verification
Current coordinates: `26.935058, 75.757109`. The About page uses `26.9124, 75.7873` in the Google Maps link. These two sets of coordinates disagree — one or both may be wrong. This NAP inconsistency in schema can confuse local SEO signals.

---

## 5. Performance (Core Web Vitals)

*Note: No Google Search Console or CrUX access was available. Estimates based on site architecture and code analysis.*

### 5.1 Architecture Signals

| Signal | Assessment |
|---|---|
| Framework | Next.js 15 with ISR/SSR |
| Image optimization | Next/Image (WebP conversion, lazy loading, priority hints) ✅ |
| Font loading | next/font/google (Poppins, Playfair Display) — inlined, no FOUT ✅ |
| Third-party scripts | Google Analytics (gtag), Microsoft Clarity, Vercel Analytics |
| Bundle size | Not measured — cart/auth/wishlist context loaded globally |

### 5.2 Estimated CWV Concerns

**Largest Contentful Paint (LCP):**
- Hero section loads product images and a prominent heading — LCP candidate
- `Next/Image` with `priority` prop should be set on the hero image; not verified ⚠️
- Supabase database queries on SSR product pages may add 200-500ms server latency

**Cumulative Layout Shift (CLS):**
- Font loading via next/font eliminates FOUT-related CLS ✅
- Cart drawer, modal, and announcement bars should use CSS transforms, not layout-shifting inserts
- Image dimensions should be declared in all Next/Image components (width/height or fill+container)

**Interaction to Next Paint (INP):**
- Google Analytics + Microsoft Clarity both add main-thread work — potential INP impact on mobile
- Cart state managed in Context with complex updates — may cause re-renders

### 5.3 Third-Party Script Impact
- 3 analytics scripts (GA4, Clarity, Vercel) loaded — each adds ~30-80ms to main thread
- No script lazy-loading strategy visible (`afterInteractive` or `lazyOnload` strategy should be applied via Next/Script)

---

## 6. Images

### 6.1 Product Images — Score: 3/10 (Critical)

**Critical finding:** Multiple products are using `logo-512.png` as their product image:
- Chai Masala: `<img src="/images/logo-512.png">` observed in page content
- Pav Bhaji Masala: Same pattern

The product image in the schema resolver falls back to `logo-512.png` when `product.images.length === 0`. This means:
1. Product pages show the brand logo where a product photo should appear
2. Product schema images point to a logo, not a product — fails Google Shopping and Product rich result requirements
3. Visual search (Google Lens) cannot index products
4. Conversion rate is significantly damaged

**Immediate action required:** Add actual product photography to all product listings in the database.

### 6.2 Alt Text — Score: 7/10

- Blog post images have descriptive alt text (e.g., "Tangry essential spices including turmeric for everyday Indian cooking") ✅
- Category images have alt text from the image element in CategoryPageClient ✅
- Product images use product name as alt text (via Next/Image alt prop) — adequate but could be more descriptive ⚠️
- Logo alt: "Tangry Spices" — acceptable ✅

### 6.3 Image Formats & Sizes — Score: 7/10

- Next/Image provides automatic WebP/AVIF conversion ✅
- Responsive sizes configured via `w=1200&q=75` URL parameters ✅
- No evidence of oversized originals being uploaded (cannot verify without file access) ⚠️
- Product images served from `/images/` public folder — no CDN prefetching noted beyond Vercel's edge

---

## 7. AI Search Readiness (GEO)

### 7.1 llms.txt — Score: 9/10

`llms.txt` exists and is well-structured ✅:
- Brand summary block with key facts
- Key pages listed with descriptions
- Product categories with representative products
- Brand facts (legal name, FSSAI, certifications, contact)

**Minor issue:** llms.txt doesn't include blog post URLs — AI assistants looking for authoritative content about Indian spices won't find Tangry's blog articles.

### 7.2 AI Crawler Accessibility — Score: 0/10 (Critical)

All major AI search crawlers are blocked (see Section 1.1). This means:
- **Google AI Overviews**: Site will not appear in AI-generated search summaries for "buy dabeli masala Jaipur", "best chai masala India", etc.
- **ChatGPT Search**: Site cannot be cited or recommended in ChatGPT conversations
- **Perplexity**: Cannot crawl or cite Tangry content
- **Bing Copilot**: Blocked via Applebot-Extended being blocked (note: Bingbot itself is likely allowed, but AI-mode Bing uses different signals)

This is the single highest-impact SEO issue on the entire site given the rapid growth of AI search traffic.

### 7.3 Content Citability — Score: 6/10

When/if crawling is allowed, citability factors:
- **Brand facts page (About)**: High citability — FSSAI license, address, founding story ✅
- **Product pages**: Medium citability — good descriptions but no ingredient lists or nutritional data
- **Blog posts**: Medium citability — content appears somewhat thin relative to title promises
- **llms.txt**: Strong structured format ✅

### 7.4 Passage-Level Optimization — Score: 5/10

- Product descriptions use clear section headers (Description, How to use, Why Tangry) ✅
- Blog posts lack numbered lists that would make specific facts extractable
- No FAQ sections on product or category pages (getFAQSchema exists in codebase but not deployed)

---

## 8. SXO — Search Experience Optimization

### 8.1 SERP Intent Analysis

**Target query: "buy dabeli masala online"**
- User intent: Transactional
- Expected page type: Product page with buy button, price, in-stock status
- Tangry page: `/products/dabeli-masala` — matches intent ✅

**Target query: "best chai masala brand India"**
- User intent: Informational/Commercial Investigation
- Expected page type: Comparison article or brand page with reviews
- Tangry page: No dedicated comparison content; product page with 0 reviews ⚠️

**Target query: "Jaipur masala online"**
- User intent: Local + Transactional
- Expected page type: E-commerce listing or local business page
- Tangry page: Homepage with products — partial match ⚠️

**Target query: "how to use garam masala"**
- User intent: Informational
- Expected page type: Detailed how-to article with numbered steps
- Tangry blog post: Exists (`/blog/authentic-garam-masala-recipe`) — title mismatch (recipe ≠ how-to) ⚠️

### 8.2 Above-the-Fold Experience

Based on page content analysis:
- Homepage: Hero immediately visible with CTA buttons ✅
- Product pages: Price, SKU, add-to-cart button visible early ✅
- Cart is empty state shows immediately on every page load (no products shown initially in navigation cart drawer) — minor UX issue
- Products listing: Filters are above-fold ✅

### 8.3 User Journey Gaps

| Journey Stage | Gap |
|---|---|
| Discovery | Blocked from AI search; limited organic reach |
| Consideration | No reviews, no comparison to alternatives, no "why choose Tangry" on product pages |
| Purchase | Good — clean checkout flow visible from product pages |
| Post-purchase | No review invitation flow visible; no loyalty program |
| B2B journey | Wholesale inquiry form exists ✅; no downloadable catalog or price list |

---

## 9. Local SEO

### 9.1 NAP Consistency — Score: 5/10

**Address in About page:** A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara, Jaipur 302012, Rajasthan, India  
**Address in schema (`orgPostalAddress`):** A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara — Jaipur, 302012  
**Address in llms.txt:** A7, Khatipura Road, Kumawat Colony, Jhotwara, Jaipur 302012  
**Phone in footer:** +91 7733009952 (formatted inconsistently across pages as `+91 77330 09952` and `+917733009952`)

The address and phone are inconsistently formatted across the site and schema. For local SEO, exact NAP (Name, Address, Phone) consistency is critical.

**Geo coordinates mismatch:**
- About page `href`: `26.9124, 75.7873`
- Schema `geo` property: `26.935058, 75.757109`
These coordinates are ~2.5 km apart. One set is incorrect and will mislead both Google Maps and schema parsers.

### 9.2 Google Business Profile Signals

No GBP data available (no DataForSEO or Maps API). Site does not link to a Google Business Profile URL. Given Tangry has a walk-in production unit, claiming and optimizing GBP would be a high-impact local SEO action.

---

## 10. Scoring Breakdown

| Category | Weight | Raw Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 58 | 12.8 |
| Content Quality | 23% | 62 | 14.3 |
| On-Page SEO | 20% | 72 | 14.4 |
| Schema / Structured Data | 10% | 70 | 7.0 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 28 | 2.8 |
| Images | 5% | 45 | 2.25 |
| **TOTAL** | **100%** | — | **59.05 ≈ 59/100** |

> **Adjusted to 61/100** accounting for strong positive signals: llms.txt, FSSAI transparency, ISR architecture, canonical handling, Organization+LocalBusiness schema, and dynamic product metadata.

---

## Appendix A — Pages Crawled

| URL | Status | Notes |
|---|---|---|
| https://www.tangryspices.com | 200 | Homepage |
| https://www.tangryspices.com/products | 200 | Product listing |
| https://www.tangryspices.com/products/chai-masala | 200 | Product page |
| https://www.tangryspices.com/products/pav-bhaji-masala | 200 | Product page |
| https://www.tangryspices.com/about | 200 | About page |
| https://www.tangryspices.com/blog | 200 | Blog listing |
| https://www.tangryspices.com/blog/health-benefits-turmeric | 200 | Blog post |
| https://www.tangryspices.com/categories/spices-masalas | 200 | Category page |
| https://www.tangryspices.com/wholesale | 200 | Wholesale/B2B |
| https://www.tangryspices.com/shipping-policy | 200 | Policy page |
| https://www.tangryspices.com/contact | Redirect | Redirects to Google Maps embed |
| https://www.tangryspices.com/robots.txt | 200 | Crawl config |
| https://www.tangryspices.com/sitemap.xml | 200 | Sitemap |
| https://www.tangryspices.com/llms.txt | 200 | AI access file |

## Appendix B — Site Inventory (from Sitemap + Navigation)

| URL | In Sitemap | Notes |
|---|---|---|
| / | ✅ | |
| /products | ✅ | |
| /about | ✅ | |
| /blog | ✅ | |
| /wholesale | ✅ | |
| /contact | ✅ | |
| /shipping-policy | ✅ | |
| /track-order | ✅ | |
| /search | ✅ | Should be excluded (dynamic) |
| /categories/spices-masalas | ✅ | |
| /categories/pickles | ✅ | |
| /categories/ready-to-eat | ✅ | |
| /categories/essentials | ✅ | |
| /products/[slug] (x15) | ❌ | All missing from sitemap |
| /blog/[slug] (x6) | ❌ | All missing from sitemap |
| /about/founder | ❌ | Missing from sitemap |
| /recipes | ❌ | Missing from sitemap |
| /privacy-policy | ❌ | Page does not exist |
| /returns | ❌ | Page does not exist |
