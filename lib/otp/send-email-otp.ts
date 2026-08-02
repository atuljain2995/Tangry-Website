function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isDevOtpFallback(): boolean {
  if (process.env.OTP_DEV_MODE === 'true') return true;
  return process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY?.trim();
}

type SendEmailOtpResult = { ok: true } | { ok: false; error: string };

/** Send COD checkout OTP via Resend. Logs to console in dev when RESEND is not configured. */
export async function sendOtpEmail(to: string, otp: string): Promise<SendEmailOtpResult> {
  if (isDevOtpFallback()) {
    console.info(`[COD OTP dev] ${to}: ${otp}`);
    return { ok: true };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: 'Email service is not configured. Contact support.' };
  }

  const from =
    process.env.ORDER_CONFIRMATION_FROM?.trim() || 'Tangry Spices <onboarding@resend.dev>';

  const subject = `${otp} is your Tangry Spices verification code`;
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
<p>Your verification code for Cash on Delivery checkout:</p>
<p style="font-size:32px;font-weight:800;letter-spacing:6px;margin:24px 0">${escapeHtml(otp)}</p>
<p style="color:#666;font-size:14px">Valid for 10 minutes. If you did not request this, you can ignore this email.</p>
<p style="color:#666;font-size:14px">— Tangry Spices</p>
</body></html>`;

  try {
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
      }),
    });

    if (res.ok) return { ok: true };

    const text = await res.text();
    console.error('Resend OTP email failed:', res.status, text.slice(0, 300));
    return { ok: false, error: 'Could not send verification email. Please try again.' };
  } catch (err) {
    console.error('Resend OTP network error:', err);
    return { ok: false, error: 'Could not send verification email. Please try again.' };
  }
}
