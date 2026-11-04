import Link from 'next/link';
import { Bike, Search } from 'lucide-react';

const LINKS = [
  { href: '/bikes', label: 'Bikes' },
  { href: '/best/best-mileage-bikes', label: 'Best Bikes' },
  { href: '/compare', label: 'Compare' },
  { href: '/tools', label: 'Tools' },
  { href: '/news', label: 'Articles' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 lg:h-16">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bike className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-black tracking-tighter">BIKE<span className="text-primary">CHALA</span></span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 pl-4 text-sm font-semibold lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <form action="/bikes" method="GET" role="search" className="relative hidden w-64 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" name="q" placeholder="Search bikes…" aria-label="Search bikes" className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </form>
        <Link href="/bikes" aria-label="Search bikes" className="rounded-xl p-2.5 active:bg-muted sm:hidden">
          <Search className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
