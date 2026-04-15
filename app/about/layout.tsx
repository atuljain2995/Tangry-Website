import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Our Story, Mission & Certifications',
  description:
    'Tangry — Taste of Home. Learn how we craft authentic Rajasthani masalas and spices in Jhotwara, Jaipur. FSSAI licensed (12225026001713), ISO 22000 certified. Zero fillers, lab-tested, small-batch blending.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Tangry Spices — Rooted in Rajasthan',
    description:
      'Small-batch masalas and spices from Jhotwara, Jaipur. FSSAI licensed, ISO 22000 certified. Our story, values, and commitment to purity.',
    url: 'https://www.tangryspices.com/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
