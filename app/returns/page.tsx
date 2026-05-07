import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/lib/data/constants';

const LAST_UPDATED = '7 May 2026';

export default function ReturnsPage() {
  return (
    <PageShell>
      <article className="container mx-auto px-6 py-20 mt-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Returns &amp; Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <p>
              We want you to be happy with every order. If something is wrong, we will work with
              you to make it right. Please read the policy below so you know exactly what to expect.
            </p>
          </section>

          {/* 1. Return window */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Return window</h2>
            <p>
              You may request a return within <strong>7 days of delivery</strong>. Requests raised
              after 7 days of the delivery date will not be accepted unless the item was sent in error by us.
            </p>
          </section>

          {/* 2. Eligible items */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Items eligible for return</h2>
            <p>A return will be accepted if:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>The product is <strong>unopened and sealed</strong> in its original packaging.</li>
              <li>The product arrived <strong>damaged, leaking, or defective</strong>.</li>
              <li>You received the <strong>wrong item</strong> (different SKU or flavour than ordered).</li>
              <li>The product is within its best-before date at the time of return request.</li>
            </ul>
          </section>

          {/* 3. Non-eligible items */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Items not eligible for return</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Opened or partially used products (for food safety and hygiene reasons).</li>
              <li>Products returned after 7 days of delivery.</li>
              <li>Items damaged due to mishandling after delivery.</li>
            </ul>
          </section>

          {/* 4. How to initiate */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. How to initiate a return</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                Email us at{' '}
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-orange-600 font-medium hover:underline"
                >
                  {COMPANY_INFO.email}
                </a>{' '}
                with the subject line <strong>&ldquo;Return Request — Order #[your order number]&rdquo;</strong>.
              </li>
              <li>
                Include your order number, the item(s) you wish to return, and the reason. For
                damaged or wrong items, attach clear photos of the product and packaging.
              </li>
              <li>
                We will reply within <strong>2 business days</strong> with a return authorisation
                and instructions. Do not ship anything back before receiving authorisation — we
                cannot guarantee credit for unauthorised returns.
              </li>
              <li>
                Pack the item(s) securely in the original packaging where possible and ship to the
                address provided in our authorisation email.
              </li>
            </ol>
          </section>

          {/* 5. Shipping costs */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Return shipping costs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
                      Reason for return
                    </th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
                      Who pays return shipping
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Damaged / defective / wrong item</td>
                    <td className="px-4 py-3 font-medium text-green-700">We bear the cost</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Change of mind (unopened, sealed)</td>
                    <td className="px-4 py-3 text-gray-700">Customer bears the cost</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              For returns we cover, we will either send a prepaid label or reimburse reasonable
              courier charges (up to ₹150) against a receipt.
            </p>
          </section>

          {/* 6. Refunds */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Refund process &amp; timeline</h2>
            <p>
              Once we receive and inspect the returned item, we will notify you by email within{' '}
              <strong>2 business days</strong>. If approved:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Refunds are processed to the <strong>original payment method</strong>.
              </li>
              <li>
                You should see the credit within <strong>5–7 business days</strong> depending on
                your bank or payment provider.
              </li>
              <li>
                Original shipping charges are non-refundable.
              </li>
            </ul>
          </section>

          {/* 7. Exchanges */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Exchanges</h2>
            <p>
              We do not offer direct exchanges at this time. If you want a different product,
              please return the original item (if eligible) and place a new order. We will process
              your refund as described above once the return is received.
            </p>
          </section>

          {/* 8. Cancellations */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Order cancellations</h2>
            <p>
              Orders can be cancelled within <strong>1 hour of placement</strong> or before the
              order is dispatched, whichever is earlier. Email us immediately at{' '}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="text-orange-600 font-medium hover:underline"
              >
                {COMPANY_INFO.email}
              </a>{' '}
              or call{' '}
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="text-orange-600 font-medium hover:underline"
              >
                {COMPANY_INFO.phone}
              </a>
              . Once dispatched, the standard return process applies.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Questions</h2>
            <p>
              For anything not covered here, reach us at{' '}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="text-orange-600 font-medium hover:underline"
              >
                {COMPANY_INFO.email}
              </a>{' '}
              or use the{' '}
              <Link href="/contact" className="text-orange-600 font-medium hover:underline">
                contact form
              </Link>
              . We aim to respond within 2 business days.
            </p>
          </section>

        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/shipping-policy" className="text-orange-600 hover:underline font-medium">
            Shipping Policy
          </Link>
          {' · '}
          <Link href="/privacy-policy" className="text-orange-600 hover:underline font-medium">
            Privacy Policy
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
