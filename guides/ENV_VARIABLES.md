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
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

---

## Site Configuration

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=everestspices.com
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
- ✅ At least one payment gateway (Razorpay OR Stripe)

### Optional (Can add later):
- ⭕ Authentication (for user accounts)
- ⭕ Email service (for notifications)
- ⭕ Analytics (for tracking)
- ⭕ WhatsApp (for support)

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

