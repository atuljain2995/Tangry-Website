# Environment Variables Configuration

Copy these variables to your `.env.local` file and replace with your actual values.

## Database Configuration

### Option A: Supabase (Recommended)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Option B: Direct PostgreSQL

```env
DATABASE_URL=postgresql://username:password@host:5432/database
```

---

## Payment Gateways

### Razorpay (India)

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
```

### Stripe (International)

```env
STRIPE_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx
```

---

## Authentication

### NextAuth

```env
NEXTAUTH_SECRET=generate_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

### Google OAuth (Optional)

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Email Service

### Resend (Recommended)

```env
RESEND_API_KEY=re_xxxxxx
# Optional: verified domain sender (defaults to Resend onboarding address)
ORDER_CONFIRMATION_FROM=Tangry Spices <orders@yourdomain.com>
```

When `RESEND_API_KEY` is set, the app sends:

- **Order confirmation** — after successful **COD** or **verified Razorpay** checkout
- **Review request** — 3–5 days after delivery via the daily cron at `/api/cron/review-requests`

Without `ORDER_CONFIRMATION_FROM`, a default Resend sender is used (may only deliver to your account email until you verify a domain).

---

## Scheduled jobs (Vercel Cron)

### Review request emails

```env
# Required for /api/cron/review-requests (Vercel sends this as Authorization: Bearer …)
CRON_SECRET=generate_a_long_random_string_here
```

Configure in **Vercel → Project → Settings → Environment Variables**. Vercel Cron automatically attaches `CRON_SECRET` as a Bearer token when calling the cron path defined in `vercel.json`.

Requires migration **017_order_review_requests.sql** and `RESEND_API_KEY` above. Without `CRON_SECRET`, the endpoint returns 401 and no review emails are sent.

Manual test (local or staging):

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://www.tangryspices.com/api/cron/review-requests"
```

### SendGrid (Alternative)

```env
SENDGRID_API_KEY=SG.xxxxxx
```

### Brevo/Sendinblue (Alternative)

```env
BREVO_API_KEY=your_api_key
```

---

## Analytics & Tracking

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
```

---

## WhatsApp Business

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=917733009952
```

---

## Marketplace “Buy online” links (homepage)

Until you have official brand storefront URLs, the site uses search links for “tangry”. Override with your listing URLs:

```env
NEXT_PUBLIC_TANGRY_FLIPKART_URL=https://www.flipkart.com/...
```

---

## Navigation (hide Recipes until content is ready)

```env
# Recipes are hidden from header + mobile menu by default (placeholder content).
# Set to true when real Tangry-linked recipes and images are published.
NEXT_PUBLIC_SHOW_RECIPES_NAV=true

# Set to false to hide the blog link (pages still exist if visited directly)
NEXT_PUBLIC_SHOW_BLOG_NAV=false
```

---

## Site Configuration

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=tangryspices.com
```

---

## How to Set Up

### Development (.env.local)

1. Create `.env.local` in project root
2. Copy variables from above
3. Replace with your values
4. Never commit this file to git

### Production (Vercel/Netlify)

1. Go to project settings
2. Environment Variables section
3. Add each variable
4. Redeploy

---

## Security Notes

⚠️ **Important:**

- Never commit `.env.local` to version control
- Use test keys for development
- Use production keys only in production
- Keep service role keys secret
- Rotate keys if exposed

---

## Testing Variables

To test if variables are loaded:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('GA ID:', process.env.NEXT_PUBLIC_GA_ID);
// Don't log secret keys!
```

---

## Required vs Optional

### Required for Basic Functionality:

- ✅ Database (Supabase OR PostgreSQL)
- ✅ Razorpay keys (for online payments) — COD works without keys

### Recommended for Production:

- ✅ `CRON_SECRET` — review-request cron (see Scheduled jobs above)
- ✅ `RESEND_API_KEY` — order confirmation + review request emails

### Optional (Can add later):

- ⭕ Analytics (GA4, Clarity, Meta Pixel)
- ⭕ WhatsApp number override
- ⭕ Cloudflare R2 / Supabase Storage for admin uploads

---

## Quick Start

Minimum variables to start:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Payment (at least one)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

You can add other variables as you implement features!
