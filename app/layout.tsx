import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebVitals } from "@/components/analytics/WebVitals";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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
    "Tangry — Taste of Home. Masalas, ready powders, and pickles from Jhotwara, Jaipur. FSSAI licensed, ISO 22000. Shop dabeli masala, pav bhaji, gun powder, turmeric & more.",
  keywords: [
    "tangry spices jaipur",
    "rajasthani masala online",
    "dabeli masala",
    "pav bhaji masala",
    "pickles jaipur",
    "turmeric powder india",
    "gun powder podi",
    "tangry masala",
  ],
  authors: [{ name: "Tangry Spices" }],
  creator: "Tangry Spices",
  publisher: "Tangry Spices",
  metadataBase: new URL("https://tangryspices.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tangry Spices | Masalas & Pickles from Jaipur",
    description:
      "Authentic Rajasthani masalas and pickles from Tangry, Jaipur. FSSAI & ISO 22000 certified.",
    url: "https://tangryspices.com",
    siteName: "Tangry Spices",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tangry Spices",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tangry Spices | Jaipur Masalas & Pickles",
    description:
      "Shop Tangry — Taste of Home. FSSAI licensed blends from Jaipur.",
    images: ["/twitter-image.jpg"],
    creator: "@tangryspices",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Ownership verified via DNS record in Cloudflare (Google Search Console)
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tangry Spices",
  url: "https://tangryspices.com",
  logo: {
    "@type": "ImageObject",
    url: "https://tangryspices.com/images/logo-512.png",
    width: 512,
    height: 512,
  },
  image: "https://tangryspices.com/images/logo-512.png",
  description:
    "Tangry — Taste of Home. Authentic Rajasthani masalas, ready powders, and pickles from Jhotwara, Jaipur. FSSAI licensed, ISO 22000 certified.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jhotwara",
    addressRegion: "Jaipur, Rajasthan",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.instagram.com/tangryspices",
    "https://www.facebook.com/tangryspices",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans antialiased bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              {children}
              <WhatsAppButton />
              <VercelAnalytics />
              <SpeedInsights />
              <WebVitals />
              <GoogleAnalytics />
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
