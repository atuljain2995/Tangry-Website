import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/lib/data/constants';

const LAST_UPDATED = '7 May 2026';

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <article className="container mx-auto px-6 py-20 mt-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <p>
              This Privacy Policy explains how <strong>{COMPANY_INFO.legalName}</strong> (trading
              as <strong>{COMPANY_INFO.brandName}</strong>, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, and protects information about
              you when you visit{' '}
              <a href="https://www.tangryspices.com" className="text-orange-600 hover:underline">
                tangryspices.com
              </a>{' '}
              or make a purchase from us.
            </p>
          </section>

          {/* 1. Data we collect */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. What data we collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account &amp; order data</h3>
                <p>
                  When you place an order or create an account we collect your name, email address,
                  phone number, delivery address, and order details (products, quantities, amounts).
                  Payment processing is handled by Razorpay; we do not store card numbers or UPI
                  credentials on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Newsletter sign-ups</h3>
                <p>
                  If you subscribe to our newsletter we collect your email address and the date of
                  consent. You can unsubscribe at any time via the link in any email we send.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Contact &amp; enquiry data</h3>
                <p>
                  When you fill out the contact or wholesale enquiry form we collect your name,
                  email, phone number, and message content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Automatically collected data
                </h3>
                <p>
                  We collect standard web server logs (IP address, browser type, referring URL,
                  pages visited, timestamps) and analytics data described in the Cookies section
                  below.
                </p>
              </div>
            </div>
          </section>

          {/* 2. How we use data */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Order fulfilment</strong> — processing payments, packing, shipping, and
                sending order confirmation and tracking emails.
              </li>
              <li>
                <strong>Customer support</strong> — responding to your queries, returns, or
                complaints.
              </li>
              <li>
                <strong>Newsletter &amp; marketing</strong> — sending product updates, recipes, and
                offers to subscribers who have opted in. You can opt out at any time.
              </li>
              <li>
                <strong>Site improvement</strong> — using aggregated, anonymised analytics to
                understand how visitors use the site and improve the experience.
              </li>
              <li>
                <strong>Legal obligations</strong> — retaining transaction records as required under
                the IT Act 2000 and applicable GST rules.
              </li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information to third parties for their
              own marketing purposes.
            </p>
          </section>

          {/* 3. Cookies */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies &amp; analytics</h2>
            <p className="mb-3">
              We use the following third-party services that may set cookies or collect usage data:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
                      Service
                    </th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
                      Purpose
                    </th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
                      Data sent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">Google Analytics 4</td>
                    <td className="px-4 py-3 text-gray-600">Page views, user behaviour, conversions</td>
                    <td className="px-4 py-3 text-gray-600">Anonymised usage events (IP anonymised)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">Microsoft Clarity</td>
                    <td className="px-4 py-3 text-gray-600">Session recordings, heatmaps</td>
                    <td className="px-4 py-3 text-gray-600">Mouse movements, clicks (no payment data)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">Vercel Analytics</td>
                    <td className="px-4 py-3 text-gray-600">Core Web Vitals, page performance</td>
                    <td className="px-4 py-3 text-gray-600">Anonymised performance metrics</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">Razorpay</td>
                    <td className="px-4 py-3 text-gray-600">Payment processing</td>
                    <td className="px-4 py-3 text-gray-600">Payment details (handled entirely by Razorpay)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Most browsers allow you to refuse cookies or delete existing ones. Doing so may affect
              site functionality. Google Analytics data can be opted out of via the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </section>

          {/* 4. Data sharing */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Who we share data with</h2>
            <p>We share personal data only with service providers necessary to run the business:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Supabase</strong> — database hosting for orders, accounts, and product
                data.
              </li>
              <li>
                <strong>Razorpay</strong> — payment gateway. Subject to{' '}
                <a
                  href="https://razorpay.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Razorpay&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Courier partners</strong> — your name, phone number, and delivery address
                are shared with the shipping carrier to fulfil your order.
              </li>
              <li>
                <strong>Vercel</strong> — hosting infrastructure. No personal data is stored by
                Vercel beyond standard server logs.
              </li>
            </ul>
            <p className="mt-3">
              We do not transfer personal data outside India except where required by the services
              listed above (e.g. Google Analytics servers). Where applicable, standard contractual
              protections apply.
            </p>
          </section>

          {/* 5. Data retention */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. How long we keep your data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Order records</strong> — retained for 7 years to comply with GST and
                accounting requirements.
              </li>
              <li>
                <strong>Account data</strong> — retained while your account is active. You can
                request deletion at any time (see below).
              </li>
              <li>
                <strong>Newsletter subscriptions</strong> — retained until you unsubscribe.
              </li>
              <li>
                <strong>Analytics data</strong> — retained per the default retention settings of
                each platform (typically 14 months for GA4).
              </li>
            </ul>
          </section>

          {/* 6. Your rights */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your rights</h2>
            <p>Under applicable Indian law (IT Act 2000 &amp; DPDP Act) you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Request a copy of the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated personal data (subject to legal retention requirements).</li>
              <li>Withdraw consent for newsletter communications at any time.</li>
              <li>Raise a grievance with our data officer.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{' '}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="text-orange-600 font-medium hover:underline"
              >
                {COMPANY_INFO.email}
              </a>{' '}
              with the subject line &ldquo;Data Request&rdquo;. We will respond within 30 days.
            </p>
          </section>

          {/* 7. Security */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Security</h2>
            <p>
              We use HTTPS across the entire site. Passwords are hashed and never stored in plain
              text. Payment details are handled exclusively by Razorpay and never touch our servers.
              While we take reasonable precautions, no system is perfectly secure; please contact us
              immediately if you suspect unauthorised access to your account.
            </p>
          </section>

          {/* 8. Children */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s privacy</h2>
            <p>
              Our site is not directed at children under 13. We do not knowingly collect personal
              data from children. If you believe a child has provided us with personal information,
              please contact us and we will delete it promptly.
            </p>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
              date at the top of this page will always reflect the most recent version. Continued
              use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact &amp; grievance officer</h2>
            <address className="not-italic space-y-1">
              <p className="font-semibold text-gray-900">{COMPANY_INFO.legalName}</p>
              <p>{COMPANY_INFO.address}</p>
              <p>
                Email:{' '}
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-orange-600 font-medium hover:underline"
                >
                  {COMPANY_INFO.email}
                </a>
              </p>
              <p>
                Phone:{' '}
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="text-orange-600 font-medium hover:underline"
                >
                  {COMPANY_INFO.phone}
                </a>
              </p>
            </address>
          </section>

        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/shipping-policy" className="text-orange-600 hover:underline font-medium">
            Shipping Policy
          </Link>
          {' · '}
          <Link href="/contact" className="text-orange-600 hover:underline font-medium">
            Contact
          </Link>
        </p>
      </article>

      <Footer />
    </PageShell>
  );
}
