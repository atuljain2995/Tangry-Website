'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isMobile?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavLink = ({
  href,
  children,
  isMobile = false,
  onClick,
  className = '',
}: NavLinkProps) => {
  const pathname = usePathname();

  const baseClasses = isMobile
    ? `block cursor-pointer border-b border-gray-100 py-3 font-bold hover:text-orange-600 dark:border-neutral-800 dark:hover:text-orange-400 ${className}`
    : `group relative cursor-pointer transition hover:text-orange-600 dark:hover:text-orange-400 ${className}`;

  // If href starts with #, it's a hash link for homepage sections
  // If we're not on homepage, prepend / to go home first
  const finalHref = href.startsWith('#') && pathname !== '/' ? `/${href}` : href;

  return (
    <Link href={finalHref} className={baseClasses} onClick={onClick}>
      {children}
      {!isMobile && (
        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
      )}
    </Link>
  );
};
