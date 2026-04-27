import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { blogPosts, getBlogPost } from '@/lib/data/blog';
import { BlogPostChrome } from './BlogPostChrome';

const SITE_URL = 'https://www.tangryspices.com';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      images: [{ url: `${SITE_URL}${post.image}`, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${SITE_URL}${post.image}`],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tangry Spices',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-512.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  };

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <BlogPostChrome>
      <StructuredData data={articleSchema} />

      <article className="pt-20">
        {/* Full-width hero image */}
        <div className="relative h-[320px] md:h-[420px] w-full bg-gray-100">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 container mx-auto max-w-4xl px-4 pb-10">
            <Link
              href="/blog"
              className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to Spice Stories
            </Link>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
              {post.category}
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Article meta bar */}
        <div className="border-b border-gray-100 bg-white dark:bg-neutral-950 dark:border-neutral-800">
          <div className="container mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
            <span className="text-gray-300 dark:text-neutral-700">•</span>
            <span>{post.authorRole}</span>
            <span className="text-gray-300 dark:text-neutral-700">•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
            <span className="text-gray-300 dark:text-neutral-700">•</span>
            <time dateTime={post.updated}>
              Updated {new Date(post.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </div>
        </div>

        {/* Body + Sidebar */}
        <div className="container mx-auto max-w-6xl px-4 py-12 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          {/* Article body */}
          <div>
            {/* Excerpt / Intro */}
            <p className="mb-10 text-lg md:text-xl leading-relaxed text-gray-600 dark:text-neutral-300 border-l-4 border-orange-400 pl-5">
              {post.excerpt}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-neutral-100">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-7 text-gray-600 dark:text-neutral-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-28 space-y-6">
            {/* Product CTAs */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600 mb-2">
                Shop Tangry
              </p>
              <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-neutral-100">
                Related products
              </h2>
              <div className="space-y-3">
                {post.productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    {link.label}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related posts */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600 mb-2">
                Keep reading
              </p>
              <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-neutral-100">
                More spice stories
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="block group">
                    <div className="flex gap-3 items-start">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <Image
                          src={related.image}
                          alt={related.imageAlt}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug dark:text-neutral-100">
                          {related.title}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">{related.readTime}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            </div>
          </aside>
        </div>
      </article>
    </BlogPostChrome>
  );
}
