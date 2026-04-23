import { MetadataRoute } from 'next';

// Private paths blocked from all crawlers
const privatePaths = [
  '/api/',
  '/account/',
  '/checkout/',
  '/admin/',
  '/_next/',
  '/private/',
];

// Private paths blocked from all crawlers (less /_next/ for Googlebot)
const googlePrivatePaths = [
  '/api/',
  '/account/',
  '/checkout/',
  '/admin/',
];

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
      // ── AI Search crawlers ─────────────────────────────────────────────
      // Explicitly allowed so these bots index public content for AI search
      // citations (ChatGPT web search, Claude, Perplexity, Bing Copilot).
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: googlePrivatePaths,
      },
      // ── Training-only crawlers ─────────────────────────────────────────
      // Blocked: these only harvest training data, not search/citation value.
      {
        userAgent: 'CCBot',
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

