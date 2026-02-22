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

/**
 * Uses native <img> to avoid Next.js image optimization/validation,
 * which can throw when product image files are missing or invalid.
 */
export function ProductImage({ src, alt, fill, className, sizes, priority }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const effectiveSrc = !src || errored ? PLACEHOLDER : src;

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
