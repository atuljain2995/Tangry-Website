'use client';

import { useState } from 'react';
import Image from 'next/image';

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
 * Uses Next.js <Image> for automatic optimization (WebP/AVIF, resizing,
 * longer cache TTLs). Falls back to placeholder on error.
 */
export function ProductImage({ src, alt, fill, className, sizes, priority }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const effectiveSrc = !src || errored ? PLACEHOLDER : src;

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 400}
      height={fill ? undefined : 400}
      className={className}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setErrored(true)}
      unoptimized={effectiveSrc === PLACEHOLDER}
    />
  );
}
