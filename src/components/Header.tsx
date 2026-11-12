'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bike, Search, MapPin, Calculator, GitCompare, ChevronDown } from 'lucide-react';
import { useCompare } from '@/components/CompareStore';
import { useCity } from '@/components/CityStore';
import CityModal from '@/components/CityModal';

const SUB_NAV = [
  { href: '/bikes', label: 'All Bikes' },
  { href: '/best/best-electric-scooters', label: 'Electric' },
  { href: '/bikes?category=scooter', label: 'Scooters' },
  { href: '/best/best-mileage-bikes', label: 'Best Mileage' },
  { href: '/best/best-bikes-under-1-lakh', label: 'Under ₹1 Lakh' },
  { href: '/best/best-bikes-under-2-lakh', label: 'Under ₹2 Lakh' },
  { href: '/compare', label: 'Compare' },
  { href: '/tools/emi-calculator', label: 'EMI Calculator' },
  { href: '/tools/on-road-price-calculator', label: 'On-Road Price' },
  { href: '/news', label: 'News & Reviews' },
];

export default function Header() {
  const pathname = usePathname();
  const { picked } = useCompare();
  const { city, openCityModal } = useCity();
  const count = picked.length;

  return (
    <>
      <CityModal />
      <header className="sticky top-0 z-40 border-b border-border bg-background shadow-xs">
        {/* Top Main Utility Bar */}
        <div className="border-b border-border/60 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
            {/* Logo & City Preset */}
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/" className="group flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                  <Bike className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl font-black tracking-tighter text-foreground">
                  BIKE<span className="text-primary">CHALA</span>
                </span>
              </Link>

              {/* Interactive City Selector Modal Trigger */}
              <button
                type="button"
                onClick={openCityModal}
                className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground/90 transition-all hover:border-primary/50 hover:bg-muted active:scale-95 sm:inline-flex"
                title={`Selected city: ${city}. Click to change.`}
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{city}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>

            {/* Search Bar - Center */}
            <form action="/bikes" method="GET" role="search" className="relative hidden max-w-md flex-1 md:block lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                placeholder="Search 230+ bikes, brands, or electric scooters…"
                aria-label="Search bikes"
                className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-xs font-medium placeholder:text-muted-foreground/80 transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2">
              {/* Mobile City Selector Button */}
              <button
                type="button"
                onClick={openCityModal}
                className="flex items-center gap-1 rounded-xl border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground active:bg-muted sm:hidden"
                aria-label="Select City"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[70px] truncate">{city}</span>
              </button>

              <Link
                href="/compare"
                className="relative hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted active:bg-muted sm:inline-flex"
              >
                <GitCompare className="h-4 w-4 text-primary" />
                <span>Compare</span>
                {count > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                href="/tools/emi-calculator"
                className="hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted active:bg-muted lg:inline-flex"
              >
                <Calculator className="h-4 w-4 text-primary" />
                <span>EMI</span>
              </Link>

              <Link
                href="/bikes"
                aria-label="Search bikes"
                className="rounded-xl border border-border p-2 text-foreground active:bg-muted md:hidden"
              >
                <Search className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Categories (BikeWale / BikeDekho Style) */}
        <nav aria-label="Categories" className="bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <ul className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none sm:gap-2">
              {SUB_NAV.map((item) => {
                const active = pathname === item.href || (item.href !== '/bikes' && pathname.startsWith(item.href.split('?')[0]));
                return (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      className={`inline-block whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
