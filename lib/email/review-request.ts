const SITE_URL = 'https://www.tangryspices.com';

type ReviewRequestProduct = {
  name: string;
  slug: string;
};

export type SendReviewRequestInput = {
  to: string;
  orderNumber: string;
  customerName?: string | null;
  products: ReviewRequestProduct[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Deduplicate products by slug so a multi-line order doesn't repeat the same SKU. */
function uniqueProducts(products: ReviewRequestProduct[]): ReviewRequestProduct[] {
  const seen = new Set<string>();
  const out: ReviewRequestProduct[] = [];
  for (const p of products) {
    if (!p.slug || seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

/**
 * Sends a post-purchase review request via [Resend](https://resend.com) when
 * `RESEND_API_KEY` is set. Intended to be triggered a few days after delivery by
 * the /api/cron/review-requests job. Returns `true` when an email was dispatched.
 */
export async function sendReviewRequestEmail(input: SendReviewRequestInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !input.to?.trim()) return false;

  const products = uniqueProducts(input.products);
  if (products.length === 0) return false;

  const from =
    process.env.ORDER_CONFIRMATION_FROM?.trim() || 'Tangry Spices <onboarding@resend.dev>';

  const greetingName = input.customerName?.trim() ? escapeHtml(input.customerName.trim()) : 'there';

  const productLinks = products
    .map((p) => {
      const url = `${SITE_URL}/products/${encodeURIComponent(p.slug)}#reviews`;
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(
        p.name,
      )}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right"><a href="${url}" style="color:#D32F2F;font-weight:600;text-decoration:none">Write a review →</a></td></tr>`;
    })
    .join('');

  const subject = `How was your Tangry order? Leave a quick review`;
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
<p>Hi ${greetingName},</p>
<p>Thanks for your recent order (<strong>${escapeHtml(
    input.orderNumber,
  )}</strong>). We hope you're enjoying the flavours of Jaipur!</p>
<p>Your feedback helps other home cooks and takes less than a minute. Would you share a quick review?</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">${productLinks}</table>
<p style="color:#666;font-size:14px">Photos are welcome — real dishes help other customers the most.</p>
<p style="color:#666;font-size:14px">With gratitude,<br/>The Tangry Spices team</p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.to.trim()],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Resend review-request email failed:', res.status, text);
    return false;
  }
  return true;
}
