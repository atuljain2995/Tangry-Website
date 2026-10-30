export class FlipkartApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = 'FlipkartApiError';
    this.status = status;
    this.body = body;
  }
}

export function formatFlipkartError(error: unknown): string {
  if (error instanceof FlipkartApiError) {
    if (error.status === 401) {
      return 'Flipkart rejected the access token (401). Check FLIPKART_APP_ID / FLIPKART_APP_SECRET and that your seller app is approved in the Developer Admin portal.';
    }
    const snippet = error.body.slice(0, 280);
    return snippet ? `Flipkart API error (${error.status}): ${snippet}` : `Flipkart API error (${error.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'Unknown Flipkart API error';
}
