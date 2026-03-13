'use client';

import { useState } from 'react';

const PLACEHOLDER = '/products/placeholder.png';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Append cache-buster so updated product images (new uploads) are not served from browser cache. */
function withCacheBuster(url: string): string {
  if (!url || url === PLACEHOLDER) return url;
  const filename = url.split('/').pop()?.split('?')[0] || '';
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(filename)}`;
}

/**
 * Uses native <img> to avoid Next.js image optimization/validation,
 * which can throw when product image files are missing or invalid.
 */
export function ProductImage({ src, alt, fill, className, sizes, priority }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const effectiveSrc = !src || errored ? PLACEHOLDER : withCacheBuster(src);

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setErrored(true)}
      style={fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%', objectFit: 'cover' } : undefined}
      sizes={sizes}
    />
  );
}
