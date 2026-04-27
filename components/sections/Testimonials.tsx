import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'We switched our restaurant’s pav bhaji masala to Tangry — guests noticed the colour and taste immediately. Consistent batch after batch.',
    name: 'Rajesh M.',
    role: 'Cloud kitchen owner, Jaipur',
  },
  {
    quote:
      'Ordered dabeli masala and gun powder online. Packing looks professional and the flavours remind me of street stalls in Gujarat.',
    name: 'Anita K.',
    role: 'Home cook, Gurugram',
  },
  {
    quote:
      'Wholesale order for our kirana was straightforward. Good communication from the Tangry team and clear FSSAI details on the label.',
    name: 'Suresh P.',
    role: 'Retailer, Rajasthan',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-[#FFF8F3] border-y border-orange-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-orange-700 font-bold uppercase tracking-wider text-sm mb-2">
          What people say
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-10">
          Trusted in kitchens & stores
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <Quote className="text-orange-200 mb-3" size={28} aria-hidden />
              <p className="text-gray-700 font-medium leading-relaxed flex-1 mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-1 text-orange-500 mb-2" aria-hidden>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-orange-400 text-orange-400" />
                ))}
              </div>
              <footer className="text-sm">
                <cite className="not-italic font-bold text-gray-900">{t.name}</cite>
                <p className="text-gray-500 mt-0.5">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};
