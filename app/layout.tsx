import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/contexts/CartContext";
import { Analytics } from "@/components/analytics/Analytics";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

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
    default: "Tangry Spices - India's No.1 Spice Brand | Authentic Indian Spices",
    template: "%s | Tangry Spices"
  },
  description: "Buy authentic Indian spices online from Tangry - India's most trusted spice brand. Premium quality blended & pure spices, masalas, and ready-to-cook mixes. Free shipping on orders above ₹499.",
  keywords: [
    "spices online india",
    "buy spices online",
    "indian spices",
    "tangry spices",
    "garam masala",
    "turmeric powder",
    "authentic spices",
    "masala online"
  ],
  authors: [{ name: "Tangry Spices" }],
  creator: "Tangry Spices",
  publisher: "Tangry Spices",
  metadataBase: new URL('https://tangryspices.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tangry Spices - India's No.1 Spice Brand",
    description: "Buy authentic Indian spices online. Premium quality blended & pure spices with free shipping.",
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
    title: "Tangry Spices - India's No.1 Spice Brand",
    description: "Buy authentic Indian spices online. Premium quality spices with free shipping.",
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
      </head>
      <body className={`${poppins.variable} ${playfair.variable} font-sans`}>
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}