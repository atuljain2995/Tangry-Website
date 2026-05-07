import { PageShell } from '@/components/layout/PageShell';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from '@/components/sections/Newsletter';
import { BlogClient } from './BlogClient';

export default function BlogPage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="pt-32 pb-4 container mx-auto px-4">
        <div className="text-center">
          <p className="text-orange-700 font-bold uppercase tracking-wider text-sm mb-2">
            From the kitchen
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tight mb-3">
            Spice Stories
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
            Recipes, health tips, and everything about Indian spices.
          </p>
        </div>
      </section>

      <BlogClient />

      <Newsletter />
      <Footer />
    </PageShell>
  );
}
