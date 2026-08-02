/**
 * Email the competitor pricing PDF via Resend.
 * Usage: npx tsx scripts/send-pricing-report-email.ts [recipient@email.com]
 */
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const PDF_PATH = resolve(
  process.cwd(),
  'reports/tangry-pricing-competitor-analysis-2026-07-26.pdf',
);
const DEFAULT_TO = 'tangryspices@gmail.com';

async function main() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set in .env.local — cannot send email.');
    process.exit(1);
  }

  const to = (process.argv[2] || process.env.PRICING_REPORT_TO || DEFAULT_TO).trim();
  const from =
    process.env.ORDER_CONFIRMATION_FROM?.trim() || 'Tangry Spices <onboarding@resend.dev>';

  const pdf = readFileSync(PDF_PATH);
  const content = pdf.toString('base64');

  const subject = 'Tangry Spices — Competitor Pricing & Discount Strategy Report';
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
<p>Hi,</p>
<p>Please find attached the <strong>Competitor Pricing &amp; Discount Strategy Analysis</strong> for Tangry Spices (July 2026).</p>
<p>It covers like-for-like price comparisons vs Everest, Tata Sampann, ZOFF, Vasant, Mother&apos;s Recipe, and MTR, plus recommendations on MRP and discount badges.</p>
<p style="color:#666;font-size:14px">Generated from <code>reports/tangry-pricing-competitor-analysis-2026-07-26.pdf</code></p>
<p>— Tangry Spices</p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      attachments: [
        {
          filename: 'tangry-pricing-competitor-analysis-2026-07-26.pdf',
          content,
        },
      ],
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`Failed (${res.status}):`, body);
    process.exit(1);
  }

  console.log(`Email sent to ${to}`);
  console.log(body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
