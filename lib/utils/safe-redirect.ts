/**
 * Prevent open redirects (e.g. //evil.com passes startsWith('/') in JS).
 * Only allow same-origin relative paths.
 */
export function safeRedirectPath(redirect: unknown, fallback = '/'): string {
  if (typeof redirect !== 'string') return fallback;
  const t = redirect.trim();
  if (
    !t.startsWith('/') ||
    t.startsWith('//') ||
    t.includes(':\\') ||
    t.includes('\n') ||
    t.includes('\r')
  ) {
    return fallback;
  }
  return t;
}
