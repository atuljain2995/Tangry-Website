import type { Address } from '@/lib/types/database';

type OrderAlertInput = {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  email: string;
  shippingAddress: Address;
  items: { productName: string; variantName?: string | null; quantity: number; price: number }[];
};

const SITE_URL = 'https://www.tangryspices.com';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Sends a new-order alert to the shop owner's Telegram chat.
 * No-op unless TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set. Never throws.
 */
export async function sendTelegramOrderAlert(input: OrderAlertInput): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  const a = input.shippingAddress;
  const lines = input.items
    .map(
      (i) =>
        `• ${escapeHtml(i.productName)}${i.variantName ? ` (${escapeHtml(i.variantName)})` : ''} × ${i.quantity} — ${inr(i.price * i.quantity)}`,
    )
    .join('\n');
  const payment = input.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '✅ Paid online';

  const text = [
    `🛒 <b>New order ${escapeHtml(input.orderNumber)}</b>`,
    `<b>${inr(input.total)}</b> · ${payment}`,
    '',
    lines,
    '',
    `👤 ${escapeHtml(a.fullName ?? '')} · +91 ${escapeHtml(a.phone ?? '')}`,
    `📍 ${escapeHtml([a.city, a.state, a.postalCode].filter(Boolean).join(', '))}`,
    `✉️ ${escapeHtml(input.email)}`,
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: 'Open in admin', url: `${SITE_URL}/admin/orders` }]],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('Telegram order alert failed:', res.status, await res.text());
  } catch (err) {
    console.error('Telegram order alert error:', err);
  }
}
