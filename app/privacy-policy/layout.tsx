import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tangry Spices',
  description:
    'How Tangry Spices collects, uses, and protects your personal data — including orders, email newsletters, and cookies (GA4, Clarity, Vercel Analytics).',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
