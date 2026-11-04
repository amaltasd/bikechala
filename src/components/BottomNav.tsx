'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Bike, GitCompare, Calculator, Newspaper } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
  { href: '/bikes', label: 'Bikes', icon: Bike, match: (p: string) => p.startsWith('/bikes') || p.startsWith('/best') },
  { href: '/compare', label: 'Compare', icon: GitCompare, match: (p: string) => p.startsWith('/compare') },
  { href: '/tools', label: 'Tools', icon: Calculator, match: (p: string) => p.startsWith('/tools') },
  { href: '/news', label: 'Articles', icon: Newspaper, match: (p: string) => p.startsWith('/news') },
];

/** App-style bottom tab bar, phones and tablets only. */
export default function BottomNav() {
  const pathname = usePathname() || '/';
  const [typing, setTyping] = useState(false);

  // Hide while the on-screen keyboard is up so the bar doesn't float over the field.
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  if (typing) return null;

  return (
    <nav aria-label="Primary" className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors active:scale-95 ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-primary/10' : ''}`}>
                  <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
