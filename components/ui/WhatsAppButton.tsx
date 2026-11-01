'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { buildWhatsAppChatUrl } from '@/lib/utils/whatsapp-order';

const NUDGE_DELAY_MS = 8000;
const NUDGE_SEEN_KEY = 'tangry_wa_nudged';

export const WhatsAppButton = () => {
  const pathname = usePathname();
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [nudge, setNudge] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Mobile only (CSS ignores this on md+): get out of the way while reading, return on scroll up
        if (Math.abs(y - lastY.current) > 8) {
          setHiddenOnScroll(y > lastY.current && y > 200);
          lastY.current = y;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // One gentle nudge per session on mobile (desktop stays static)
  useEffect(() => {
    if (sessionStorage.getItem(NUDGE_SEEN_KEY) || window.matchMedia('(min-width: 768px)').matches) return;
    const t = window.setTimeout(() => {
      setNudge(true);
      sessionStorage.setItem(NUDGE_SEEN_KEY, '1');
    }, NUDGE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) return null;

  // Mobile only; product pages offer WhatsApp inside the sticky buy bar instead
  if (pathname.startsWith('/products/')) return null;

  return (
    <a
      href={buildWhatsAppChatUrl('Hi! I have a question about Tangry Spices.')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analytics.trackWhatsAppClick(pathname || '/')}
      onAnimationEnd={() => setNudge(false)}
      aria-label="Chat with us on WhatsApp"
      className={`fixed bottom-4 right-4 z-40 flex items-center rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-[transform,opacity] duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 md:hidden ${
        hiddenOnScroll ? 'pointer-events-none translate-y-24 opacity-0' : ''
      } ${nudge ? 'motion-safe:animate-wa-nudge' : ''}`}
    >
      <WhatsAppIcon className="h-7 w-7 shrink-0" />
    </a>
  );
};
