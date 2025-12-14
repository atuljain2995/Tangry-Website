# Implementation Guide for Remaining Features

This guide covers the implementation steps for features that require external services, API keys, and configurations.

## Table of Contents
1. [Payment Gateway Integration](#payment-gateway-integration)
2. [Authentication System](#authentication-system)
3. [Order Management](#order-management)
4. [Email Marketing](#email-marketing)
5. [Database Setup](#database-setup)

---

## 1. Payment Gateway Integration

### Razorpay Integration (India)

#### Step 1: Create Razorpay Account
1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Get API keys from Dashboard → API Keys

#### Step 2: Install Dependencies
```bash
npm install razorpay
```

#### Step 3: Environment Variables
Add to `.env.local`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
```

#### Step 4: Create API Route
Create `app/api/payment/razorpay/create-order/route.ts`:
```typescript
import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
```

#### Step 5: Frontend Integration
Update `components/ecommerce/PaymentOptions.tsx` to handle Razorpay:
```typescript
const handleRazorpayPayment = async () => {
  // Create order
  const response = await fetch('/api/payment/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: cart.total,
      currency: 'INR',
      receipt: orderNumber
    })
  });

  const { order } = await response.json();

  // Open Razorpay checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Everest Spices',
    description: 'Order Payment',
    order_id: order.id,
    handler: async (response: any) => {
      // Verify payment
      await verifyPayment(response);
    },
    prefill: {
      email: userEmail,
      contact: userPhone
    },
    theme: {
      color: '#D32F2F'
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

#### Step 6: Verify Payment
Create `app/api/payment/razorpay/verify/route.ts`:
```typescript
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature === expectedSign) {
    // Payment verified - update order status
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
```

### Stripe Integration (International)

#### Step 1: Create Stripe Account
1. Sign up at [https://stripe.com](https://stripe.com)
2. Get API keys from Dashboard

#### Step 2: Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

#### Step 3: Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx
```

#### Step 4: Create Checkout Session
Create `app/api/payment/stripe/create-checkout/route.ts`:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const { items, customerEmail } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.get('origin')}/checkout/cancel`,
    customer_email: customerEmail,
  });

  return NextResponse.json({ sessionId: session.id });
}
```

---

## 2. Authentication System

### Option A: NextAuth.js (Recommended)

#### Step 1: Install NextAuth
```bash
npm install next-auth
```

#### Step 2: Create Auth Configuration
Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials against database
        // Return user object if valid
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Step 3: Create Auth Pages
- `app/auth/signin/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Registration page
- `app/account/page.tsx` - User dashboard

#### Step 4: Protect Routes
```typescript
import { getServerSession } from 'next-auth';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  return <div>Protected content</div>;
}
```

### Option B: Supabase Auth

#### Step 1: Create Supabase Project
1. Sign up at [https://supabase.com](https://supabase.com)
2. Create new project
3. Get API keys

#### Step 2: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### Step 3: Initialize Client
Create `lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 3. Order Management

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  is_default BOOLEAN DEFAULT false
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),
  items JSONB,
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  total DECIMAL(10,2),
  currency VARCHAR(10),
  order_status VARCHAR(50),
  payment_status VARCHAR(50),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  images TEXT[],
  variants JSONB,
  features TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Order Tracking Implementation

Create `app/account/orders/[orderId]/page.tsx`:
```typescript
export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  // Fetch order details
  // Display order timeline
  // Show tracking information
  return (
    <div>
      <h1>Order #{params.orderId}</h1>
      {/* Order status timeline */}
      {/* Order items */}
      {/* Shipping information */}
    </div>
  );
}
```

---

## 4. Email Marketing

### Option A: Resend (Recommended)

#### Step 1: Create Resend Account
1. Sign up at [https://resend.com](https://resend.com)
2. Get API key
3. Verify domain

#### Step 2: Install Resend
```bash
npm install resend
```

#### Step 3: Create Email Templates
Create `lib/email/templates/welcome.tsx`:
```typescript
export const WelcomeEmail = ({ name }: { name: string }) => (
  <html>
    <body>
      <h1>Welcome to Everest Spices, {name}!</h1>
      <p>Thank you for joining us...</p>
    </body>
  </html>
);
```

#### Step 4: Send Emails
Create `lib/email/send.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'noreply@everestspices.com',
    to,
    subject: 'Welcome to Everest Spices',
    react: WelcomeEmail({ name }),
  });
}

export async function sendOrderConfirmation(to: string, orderData: any) {
  await resend.emails.send({
    from: 'orders@everestspices.com',
    to,
    subject: `Order Confirmation #${orderData.orderNumber}`,
    react: OrderConfirmationEmail(orderData),
  });
}
```

### Abandoned Cart Recovery

Create scheduled task (cron job or Vercel Cron):
```typescript
// app/api/cron/abandoned-cart/route.ts
export async function GET() {
  // Find carts abandoned > 1 hour
  // Send reminder email
  // Track recovery rate
}
```

### Email Campaigns Setup
1. Create segments (new customers, repeat buyers, inactive users)
2. Set up welcome series (Day 0, 3, 7)
3. Product recommendation emails
4. Win-back campaigns

---

## 5. Database Setup

### Supabase Setup (Recommended for MVP)

1. **Create Project**: [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Run Migrations**: Execute the SQL schemas above in Supabase SQL Editor

3. **Enable Row Level Security (RLS)**:
```sql
-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

4. **Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### Alternative: MongoDB Atlas

1. Create cluster at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Install mongoose: `npm install mongoose`
3. Create models based on TypeScript interfaces
4. Connect: 
```typescript
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI!);
```

---

## Additional Resources

- **Razorpay Docs**: [https://razorpay.com/docs](https://razorpay.com/docs)
- **Stripe Docs**: [https://stripe.com/docs](https://stripe.com/docs)
- **NextAuth Docs**: [https://next-auth.js.org](https://next-auth.js.org)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)

## Next Steps

1. Choose your auth provider (NextAuth or Supabase)
2. Set up database (Supabase recommended)
3. Integrate payment gateways (Razorpay for India, Stripe for international)
4. Implement email service (Resend recommended)
5. Test thoroughly in development
6. Deploy to production
7. Configure webhooks and cron jobs

