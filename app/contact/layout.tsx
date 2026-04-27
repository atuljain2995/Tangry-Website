import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Jaipur',
  description:
    'Get in touch with Tangry Spices. Reach us at our Jhotwara, Jaipur office for wholesale inquiries, product questions, or feedback.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Tangry Spices — Jaipur',
    description:
      'Reach out for wholesale inquiries, product questions, or feedback. Located in Jhotwara, Jaipur.',
    url: 'https://www.tangryspices.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
