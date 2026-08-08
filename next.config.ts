// import { withPayload } from '@payloadcms/next/withPayload'; // disabled until PAYLOAD_DATABASE_URL is configured
import type { NextConfig } from 'next';

// Shared script allowlist for CSP (script-src and script-src-elem must stay in sync)
const cspScriptSources = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  'cdn.jsdelivr.net',
  // Razorpay checkout.js + risk-detection bundle (cdn.razorpay.com)
  'https://*.razorpay.com',
  'https://www.googletagmanager.com',
  'https://www.clarity.ms',
  'https://scripts.clarity.ms',
  'https://static.cloudflareinsights.com',
  // Vercel Analytics dev script (production loads from /_vercel/insights/script.js via 'self')
  'https://va.vercel-scripts.com',
].join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${cspScriptSources}`,
  `script-src-elem ${cspScriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://www.google.com https://maps.google.com https://checkout.razorpay.com https://*.razorpay.com",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000', '10.71.68.185'],
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content-Security-Policy: prevents XSS, injection, and data exfiltration attacks
          {
            key: 'Content-Security-Policy',
            value: `${contentSecurityPolicy};`,
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig; // use `withPayload(nextConfig)` once Payload DB is configured
