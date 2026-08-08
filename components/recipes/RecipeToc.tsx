import Link from 'next/link';
import { ListOrdered } from 'lucide-react';

export type TocItem = { id: string; label: string };

export function RecipeToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="border border-neutral-200 bg-white rounded-xl p-4 mb-8 print:hidden"
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 mb-2.5">
        <ListOrdered className="w-4 h-4 text-red-600" aria-hidden="true" />
        On this page
      </h2>
      <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {items.map((item, index) => (
          <li key={item.id} className="text-sm">
            <Link
              href={`#${item.id}`}
              className="text-neutral-600 hover:text-red-700 hover:underline transition-colors"
            >
              <span className="text-neutral-400 mr-1.5">{index + 1}.</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function RecipeShare({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X', href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    { label: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <span className="text-xs text-neutral-500 mr-1">Share</span>
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-neutral-600 hover:text-red-700 border border-neutral-300 hover:border-red-300 rounded-full px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}
