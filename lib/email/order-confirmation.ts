type OrderLineForEmail = {
  productName: string;
  variantName?: string | null;
  quantity: number;
  price: number;
};

export type SendOrderConfirmationInput = {
  to: string;
  orderNumber: string;
  total: number;
  currency: string;
  items: OrderLineForEmail[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Sends a plain order confirmation via [Resend](https://resend.com) when `RESEND_API_KEY` is set.
 * Set `ORDER_CONFIRMATION_FROM` to a verified sender (e.g. `Tangry <orders@yourdomain.com>`).
 * Without a verified domain, Resend may only deliver to your account email when using their default sandbox from address.
 */
export async function sendOrderConfirmationEmail(input: SendOrderConfirmationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !input.to?.trim()) return;

  const from =
    process.env.ORDER_CONFIRMATION_FROM?.trim() || 'Tangry Spices <onboarding@resend.dev>';

  const linesHtml = input.items
    .map((line) => {
      const title = escapeHtml(line.productName);
      const sub = line.variantName ? ` — ${escapeHtml(line.variantName)}` : '';
      const qty = line.quantity;
      const each = formatMoney(line.price, input.currency);
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${title}${sub}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${qty} × ${each}</td></tr>`;
    })
    .join('');

  const totalStr = formatMoney(input.total, input.currency);
  const subject = `Order confirmed — ${input.orderNumber}`;
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
<p>Thank you for your order.</p>
<p><strong>Order number:</strong> ${escapeHtml(input.orderNumber)}</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">${linesHtml}</table>
<p style="font-size:18px"><strong>Total: ${totalStr}</strong></p>
<p style="color:#666;font-size:14px">We will send updates when your order ships.</p>
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
    console.error('Resend order email failed:', res.status, text);
  }
}
