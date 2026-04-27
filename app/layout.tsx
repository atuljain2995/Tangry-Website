import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CartProvider } from '@/lib/contexts/CartContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { WishlistProvider } from '@/lib/contexts/WishlistContext';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';

import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/utils/schema';
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});

export const metadata = {
  title: {
    default: 'Tangry Spices | Authentic Rajasthani Masalas & Pickles from Jaipur',
    template: '%s | Tangry Spices',
  },
  description:
    'Tangry — Taste of Home. Masalas, ready powders, and pickles from Jhotwara, Jaipur. FSSAI licensed, ISO 22000. Shop dabeli masala, pav bhaji, gun powder, turmeric & more.',
  keywords: [
    'tangry spices jaipur',
    'rajasthani masala online',
    'dabeli masala',
    'pav bhaji masala',
    'pickles jaipur',
    'turmeric powder india',
    'gun powder podi',
    'tangry masala',
  ],
  authors: [{ name: 'Tangry Spices' }],
  creator: 'Tangry Spices',
  publisher: 'Tangry Spices',
  metadataBase: new URL('https://www.tangryspices.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/images/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/images/logo-192.png', sizes: '192x192' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tangry Spices | Masalas & Pickles from Jaipur',
    description:
      'Authentic Rajasthani masalas and pickles from Tangry, Jaipur. FSSAI & ISO 22000 certified.',
    url: 'https://www.tangryspices.com',
    siteName: 'Tangry Spices',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tangry Spices | Jaipur Masalas & Pickles',
    description: 'Shop Tangry — Taste of Home. FSSAI licensed blends from Jaipur.',
    creator: '@tangryspices',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Ownership verified via DNS record in Cloudflare (Google Search Console)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pmknwgwbwfyvrkfbrccu.supabase.co" />
        <link rel="dns-prefetch" href="https://pmknwgwbwfyvrkfbrccu.supabase.co" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getOrganizationSchema(), getLocalBusinessSchema()]),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans antialiased bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <NextTopLoader color="#D32F2F" height={3} showSpinner={false} />
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              <WishlistProvider>
                {children}
                <WhatsAppButton />
                <VercelAnalytics />
              </WishlistProvider>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
