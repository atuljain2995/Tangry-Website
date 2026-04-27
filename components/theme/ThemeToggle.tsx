'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

/** No-op store: we only need SSR (false) vs client (true) for theme hydration. */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Light: knob right; dark: knob left. Track w-16 (4rem); travel matches padding + knob size. */
const KNOB =
  'pointer-events-none absolute top-1 left-1 h-7 w-7 rounded-full bg-[#8f9e88] shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-out translate-x-[26px] dark:translate-x-0';

const TRACK =
  'relative inline-flex h-9 w-16 shrink-0 items-center rounded-full bg-[#efe8dc] px-1.5 transition-colors dark:bg-neutral-600';

type ThemeToggleProps = {
  /** Show “Light” / “Dark” label (reference design); hide on very narrow headers if needed */
  showLabel?: boolean;
  className?: string;
};

export function ThemeToggle({ showLabel = true, className = '' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const isDark = resolvedTheme === 'dark';

  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`} aria-hidden>
        {showLabel && <span className="w-10 text-sm font-medium text-neutral-800" />}
        <div className={`${TRACK} opacity-60`}>
          <span className={KNOB} />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      {/* {showLabel && (
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )} */}
      <span className={TRACK}>
        <Sun
          className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-neutral-800 dark:text-neutral-400"
          strokeWidth={2}
          aria-hidden
        />
        <Moon
          className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-neutral-400 dark:text-neutral-200"
          strokeWidth={2}
          aria-hidden
        />
        <span className={KNOB} />
      </span>
    </button>
  );
}
