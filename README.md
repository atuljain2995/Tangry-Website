# 🌶️ Tangry Spices - E-Commerce Platform

![Tangry Spices](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

A modern, high-performance e-commerce platform for authentic Indian spices. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and PostgreSQL (Supabase).

## ✨ Features

- 🛒 **Full E-Commerce** - Shopping cart, checkout, order management
- 🎨 **Modern UI** - Bold, energetic design with smooth animations
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔍 **SEO Optimized** - Structured data, sitemaps, meta tags
- 💳 **Payments** - **Razorpay** and **COD** implemented end-to-end; Stripe appears in checkout UI but full Stripe Checkout is not wired (orders can be created as payment pending for other methods)
- 🔐 **Auth** - In-house session auth with roles (`customer`, `retailer`, `admin`); customer `/login` and `/signup`; admin routes protected via `requireAdmin()`
- 🛠️ **Admin portal** - Dashboard, orders, products (create/edit + variants), customers, discounts, inquiries, settings, sales reports, low-stock inventory
- 📊 **Analytics** - Google Analytics 4, Meta Pixel, Hotjar (loaded when real IDs are set in env)
- 🌐 **B2B Features** - Wholesale inquiries and bulk orders
- 📝 **Content Marketing** - Blog and recipe sections
- 🚀 **Performance** - Server-side rendering, optimized images
- 📧 **Order email (optional)** - Set `RESEND_API_KEY` (+ from address) to send order confirmation emails when payment completes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works!)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd everest-clone

# Install dependencies
npm install

# Set up environment variables
# Create .env.local — see guides/ENV_VARIABLES.md for all keys

# Run database migrations
# See guides/RUN_MIGRATIONS_NOW.md

# (Optional) Create an admin user — see scripts/create-admin.ts

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📚 Documentation

All detailed documentation is in the **[`/guides`](./guides)** folder:

### 🎯 Essential Guides

- **[INDEX.md](./guides/INDEX.md)** - Complete documentation index
- **[README_FIRST.md](./guides/README_FIRST.md)** - Start here!
- **[SETUP_README.md](./guides/SETUP_README.md)** - Detailed setup instructions
- **[FREE_HOSTING_GUIDE.md](./guides/FREE_HOSTING_GUIDE.md)** - Deploy to Vercel (free!)

### 💾 Database Setup

- [QUICK_START_SUPABASE.md](./guides/QUICK_START_SUPABASE.md) - 3-step Supabase setup
- [RUN_MIGRATIONS_NOW.md](./guides/RUN_MIGRATIONS_NOW.md) - Database migrations
- [ENV_VARIABLES.md](./guides/ENV_VARIABLES.md) - Environment configuration

### 🏗️ Development

- [ARCHITECTURE.md](./guides/ARCHITECTURE.md) - Project structure
- [COMPONENT_GUIDE.md](./guides/COMPONENT_GUIDE.md) - Component documentation
- [IMPLEMENTATION_GUIDE.md](./guides/IMPLEMENTATION_GUIDE.md) - Feature implementation

### 🔧 Troubleshooting

- [FIX_VARIANTS_ERROR.md](./guides/FIX_VARIANTS_ERROR.md)
- [NAVIGATION_FIX_SUMMARY.md](./guides/NAVIGATION_FIX_SUMMARY.md)
- [QUICK_FIX.md](./guides/QUICK_FIX.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** In-house session auth (see `lib/auth/`)
- **Payments:** Razorpay (live/test keys) + COD; Stripe placeholder in UI
- **Analytics:** Google Analytics 4 (optional env IDs)
- **Hosting:** Vercel (recommended)

## 📦 Project Structure

```
everest-clone/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard (role-protected)
│   ├── products/          # Product pages
│   ├── blog/              # Blog pages
│   ├── recipes/           # Recipe pages
│   ├── wholesale/         # B2B pages
│   └── checkout/          # Checkout flow
├── components/            # React components
│   ├── ecommerce/        # Shopping cart, products
│   ├── layout/           # Header, footer, navigation
│   ├── sections/         # Hero, about, features
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and data
│   ├── db/              # Database queries and types
│   ├── auth/            # Session and roles
│   ├── contexts/        # React Context (Cart)
│   └── utils/           # Helper functions
├── guides/              # 📚 All documentation
└── public/              # Static assets
```

## 🎨 Design System

### Color Palette

- **Primary:** Orange (#F97316) - Energy and warmth
- **Secondary:** Red (#EF4444) - Spice and boldness
- **Accent:** Yellow (#FBBF24) - Highlights
- **Neutral:** Gray shades - Background and text
- **Background:** Off-white (#FFF8F3) - Warm, inviting

### Typography

- **Headings:** Black (900 weight) - Bold, confident
- **Body:** Medium (500 weight) - Clear, readable
- **Uppercase:** Used for emphasis and labels
- **Tracking:** Tight for headings, wide for labels

## 🚀 Deployment

### Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

For production uploads, configure **Supabase Storage** or **Cloudflare R2** (see [UPDATE_PRODUCTS_AND_IMAGES.md](./guides/UPDATE_PRODUCTS_AND_IMAGES.md)). See **[FREE_HOSTING_GUIDE.md](./guides/FREE_HOSTING_GUIDE.md)** for complete deployment options.

## 🌟 Key Features

### E-Commerce

- ✅ Product catalog with variants
- ✅ Shopping cart with local storage
- ✅ Multi-step checkout
- ✅ Order management (store + admin)
- ✅ Razorpay + COD; Stripe UI without full gateway flow

### Marketing

- ✅ SEO optimization (meta tags, structured data)
- ✅ Blog for content marketing
- ✅ Recipe section with spice usage
- ✅ WhatsApp integration
- ✅ Newsletter signup
- ✅ Social media integration

### B2B

- ✅ Wholesale inquiry page
- ✅ Bulk order quotes
- ✅ Corporate contact forms

### Analytics

- ✅ Google Analytics 4 integration (when `NEXT_PUBLIC_GA_ID` is set)
- ✅ Conversion tracking setup
- ✅ Meta Pixel / Hotjar (when env IDs are set)

## 📈 Marketing Strategy

Low-budget marketing approach included:

- **SEO:** Organic search optimization
- **Content:** Blog posts and recipes
- **Social Media:** Instagram, Facebook, Pinterest
- **Email:** Newsletter campaigns (Brevo/SendGrid)
- **Community:** WhatsApp groups, Telegram

See **[MARKETING_STRATEGY.md](./guides/MARKETING_STRATEGY.md)** for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test-db      # Test database connection
npm run create-admin # Create an admin user (see script for env)
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by modern DTC brands
- Built with ❤️ for authentic spice lovers
- Powered by open-source technologies

## 📞 Support

- 📧 Email: tangryspices@gmail.com
- 📱 Phone / WhatsApp: +91 77330 09952
- 📚 Documentation: [/guides](./guides)

---

**Made with spice in India** 🌶️

For detailed guides and documentation, visit the **[`/guides`](./guides)** folder.
