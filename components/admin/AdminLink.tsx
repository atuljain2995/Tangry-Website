'use client';

import Link from 'next/link';
import { useLinkStatus } from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

function LinkPendingContent({
  children,
  showSpinner,
}: {
  children: ReactNode;
  showSpinner: boolean;
}) {
  const { pending } = useLinkStatus();
  return (
    <>
      {showSpinner && pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-90" aria-hidden />
      ) : null}
      {children}
    </>
  );
}

export type AdminLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  children: ReactNode;
  /** When false, no spinner (pending navigations still work). Default true. */
  showPendingSpinner?: boolean;
};

export function AdminLink({
  children,
  className,
  showPendingSpinner = true,
  ...props
}: AdminLinkProps) {
  return (
    <Link {...props} className={className}>
      <LinkPendingContent showSpinner={showPendingSpinner}>{children}</LinkPendingContent>
    </Link>
  );
}
