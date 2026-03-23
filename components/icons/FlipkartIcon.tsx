import Image from 'next/image';

/** Official-style Flipkart mark from `public/images/flipkart-icon.png`. */
export function FlipkartIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/flipkart-icon.png"
      alt=""
      width={28}
      height={28}
      className={`shrink-0 object-contain ${className ?? 'h-7 w-7'}`}
      aria-hidden
    />
  );
}
