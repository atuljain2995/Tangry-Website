import Link from 'next/link';
import { Mail, Phone, MessageCircle, HelpCircle, FileText, Truck } from 'lucide-react';

const FAQ_ITEMS = [
  { q: 'How do I track my order?', a: 'Go to the Track Order page from the footer or visit /track-order. Enter your order number and email to see real-time status.' },
  { q: 'What payment methods do you accept?', a: 'We accept Razorpay (UPI, Cards, Netbanking), Cash on Delivery for orders under ₹5,000, and bank transfer for bulk/wholesale orders.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unopened, sealed products. Contact us with your order number to initiate a return.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–7 business days across India. Orders within Rajasthan are typically delivered in 2–4 days.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship only within India. International shipping is coming soon.' },
  { q: 'How can I cancel my order?', a: 'Contact us within 24 hours of placing the order via email or WhatsApp. Once shipped, cancellations are not possible.' },
];

export default function HelpPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-neutral-100">Help & Support</h1>

      {/* Contact options */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <a
          href="mailto:support@tangryspices.com"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Mail className="h-5 w-5 text-orange-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">Email Us</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">support@tangryspices.com</p>
          </div>
        </a>
        <a
          href="tel:+918947051201"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Phone className="h-5 w-5 text-orange-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">Call Us</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">+91 89470 51201</p>
          </div>
        </a>
        <a
          href="https://wa.me/918947051201"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900"
        >
          <MessageCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">WhatsApp</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Chat with us</p>
          </div>
        </a>
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-neutral-100">Quick Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/track-order"
            className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-700 hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <Truck className="h-4 w-4 text-orange-600 shrink-0" /> Track Your Order
          </Link>
          <Link href="/shipping-policy"
            className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-700 hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <FileText className="h-4 w-4 text-orange-600 shrink-0" /> Shipping Policy
          </Link>
          <Link href="/contact"
            className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-700 hover:border-orange-300 transition dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <Mail className="h-4 w-4 text-orange-600 shrink-0" /> Contact Form
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-neutral-100">
          <HelpCircle className="h-5 w-5 text-orange-600" aria-hidden />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <details key={i} className="group rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 dark:text-neutral-100 select-none">
                {faq.q}
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
