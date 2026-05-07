import { MetadataRoute } from 'next';

// Private paths blocked from all crawlers
const privatePaths = ['/api/', '/account/', '/checkout/', '/admin/', '/private/'];

// Private paths blocked from all crawlers (less /_next/ for Googlebot)
const googlePrivatePaths = ['/api/', '/account/', '/checkout/', '/admin/'];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.tangryspices.com';

  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      // Google — standard web crawler
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      // ── AI search crawlers (power AI Overviews / ChatGPT browsing) ──
      // These crawlers serve real-time search answers, NOT training datasets.
      // Allowing them makes the site visible in Google AI Overviews and ChatGPT.
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: privatePaths,
      },
      // ── AI training crawlers — keep blocked ─────────────────────────
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
