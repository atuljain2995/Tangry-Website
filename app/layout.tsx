import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Analytics } from "@/components/analytics/Analytics";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

export const metadata = {
  title: {
    default:
      "Tangry Spices | Authentic Rajasthani Masalas & Pickles from Jaipur",
    template: "%s | Tangry Spices",
  },
  description:
    "Tangry — Taste of Home. Masalas, ready powders, and pickles from Maya Enterprises, Jhotwara Jaipur. FSSAI licensed, ISO 22000. Shop dabeli masala, pav bhaji, gun powder, turmeric & more.",
  keywords: [
    "tangry spices jaipur",
    "rajasthani masala online",
    "dabeli masala",
    "pav bhaji masala",
    "pickles jaipur",
    "turmeric powder india",
    "gun powder podi",
    "maya enterprises spices",
  ],
  authors: [{ name: "Tangry Spices" }],
  creator: "Tangry Spices",
  publisher: "Tangry Spices",
  metadataBase: new URL('https://tangryspices.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tangry Spices | Masalas & Pickles from Jaipur",
    description:
      "Authentic Rajasthani masalas and pickles from Maya Enterprises, Jaipur. FSSAI & ISO 22000 certified.",
    url: 'https://tangryspices.com',
    siteName: 'Tangry Spices',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tangry Spices',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tangry Spices | Jaipur Masalas & Pickles",
    description:
      "Shop Tangry — Taste of Home. FSSAI licensed blends from Maya Enterprises, Jaipur.",
    images: ['/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Analytics />
        <SpeedInsights />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} font-sans`}>
        <CartProvider>
          <AuthProvider>
            {children}
            <WhatsAppButton />
            <VercelAnalytics />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}