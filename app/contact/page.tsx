import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/lib/data/constants';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <PageShell>

      <div className="container mx-auto px-6 py-20 mt-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>

        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto mb-12">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Get in Touch</h2>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-[#D32F2F]"
              >
                <Mail size={20} />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="flex items-center gap-3 text-gray-700 hover:text-[#D32F2F] mt-3"
              >
                <Phone size={20} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <p className="flex items-start gap-3 text-gray-700 mt-3">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </p>
              <p className="text-sm text-gray-600 mt-3">
                {COMPANY_INFO.certifications.join(' · ')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-0 sm:px-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center sm:text-left">Find us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 sm:h-80 bg-gray-100">
            <iframe
              title="Tangry — Jhotwara, Jaipur"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY_INFO.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-center sm:text-left mt-3 text-sm text-gray-600">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold hover:underline"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </PageShell>
  );
}
