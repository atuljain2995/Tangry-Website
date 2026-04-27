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
      // ── AI / training crawlers ─────────────────────────────────────
      // Cloudflare Managed Content prepends its own Disallow blocks for
      // GPTBot, ClaudeBot, Bytespider, etc. Adding conflicting Allow here
      // is ignored because crawlers use the *first* matching directive.
      // Only list crawlers whose Cloudflare rule we do NOT want to override.
      //
      // NOTE: If you later disable Cloudflare Managed Content, re-add
      // explicit Allow rules for OAI-SearchBot, ChatGPT-User, PerplexityBot.
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

