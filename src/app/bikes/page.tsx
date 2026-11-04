import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { bikes, getBrands, CATEGORY_LABEL, type Category } from '@/lib/bikes';

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = !!(one(sp.q) || one(sp.category) || one(sp.fuel) || one(sp.brand) || one(sp.sort));
  return {
    title: 'New Bikes & Scooters in India',
    description: 'Browse every bike and scooter on BikeChala. Filter by brand, type, petrol or electric, and sort by price, power or mileage.',
    alternates: { canonical: '/bikes' },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

const SORTS: Record<string, { label: string; fn: (a: (typeof bikes)[number], b: (typeof bikes)[number]) => number }> = {
  popular: { label: 'Default', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => (a.exShowroomPriceInr ?? Infinity) - (b.exShowroomPriceInr ?? Infinity) },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => (b.exShowroomPriceInr ?? -1) - (a.exShowroomPriceInr ?? -1) },
  power: { label: 'Most powerful', fn: (a, b) => (b.powerPs ?? b.motorPowerKw ?? 0) - (a.powerPs ?? a.motorPowerKw ?? 0) },
  mileage: { label: 'Best mileage', fn: (a, b) => (b.mileageKmpl ?? 0) - (a.mileageKmpl ?? 0) },
  range: { label: 'Longest range', fn: (a, b) => (b.rangeKm ?? 0) - (a.rangeKm ?? 0) },
};

export default async function BikesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 60);
  const category = one(sp.category) as Category | '';
  const fuel = one(sp.fuel);
  const brand = one(sp.brand);
  const sort = SORTS[one(sp.sort)] ? one(sp.sort) : 'popular';
  const needle = q.toLowerCase();

  const list = bikes
    .filter((b) => (!category || b.category === category) && (!fuel || b.fuelType === fuel) && (!brand || b.brandSlug === brand) && (!needle || `${b.brand} ${b.name} ${b.category}`.toLowerCase().includes(needle)))
    .sort(SORTS[sort].fn);

  const brands = getBrands();
  const cats = [...new Set(bikes.map((b) => b.category))];
  const href = (over: Record<string, string>) => {
    const p = new URLSearchParams();
    const cur: Record<string, string> = { q, category, fuel, brand, sort: sort === 'popular' ? '' : sort, ...over };
    for (const [k, v] of Object.entries(cur)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/bikes?${s}` : '/bikes';
  };
  const chip = (on: boolean) => `flex min-h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors active:scale-95 ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'}`;

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-8">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">New bikes &amp; scooters in India</h1>
          <form action="/bikes" method="GET" role="search" className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
            {category && <input type="hidden" name="category" value={category} />}
            {fuel && <input type="hidden" name="fuel" value={fuel} />}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="search" name="q" defaultValue={q} placeholder="Search bikes…" aria-label="Search bikes" enterKeyHint="search" className="h-12 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <select name="brand" defaultValue={brand} aria-label="Brand" className="h-12 rounded-xl border border-border bg-background px-3">
              <option value="">All brands</option>
              {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name} ({b.count})</option>)}
            </select>
            <select name="sort" defaultValue={sort} aria-label="Sort" className="h-12 rounded-xl border border-border bg-background px-3">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <button className="h-12 rounded-xl bg-primary px-6 font-bold text-primary-foreground active:scale-95">Apply</button>
          </form>
        </div>
      </header>

      <nav aria-label="Filters" className="sticky top-14 z-20 border-b border-border bg-background/95 backdrop-blur-md lg:top-16">
        <div className="container mx-auto max-w-7xl">
          <div className="snap-row hide-scrollbar gap-2 px-4 py-2.5">
            <Link href={href({ category: '', fuel: '' })} className={chip(!category && !fuel)}>All</Link>
            <Link href={href({ fuel: fuel === 'electric' ? '' : 'electric', category: '' })} className={chip(fuel === 'electric')}>⚡ Electric</Link>
            {cats.map((c) => <Link key={c} href={href({ category: category === c ? '' : c, fuel: '' })} className={chip(category === c)}>{CATEGORY_LABEL[c]}</Link>)}
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl space-y-4 px-4 py-5">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>{list.length} {list.length === 1 ? 'bike' : 'bikes'}{q && <> matching “<span className="font-semibold text-foreground">{q}</span>”</>}</p>
          {(q || category || fuel || brand || sort !== 'popular') && <Link href="/bikes" className="flex min-h-10 items-center gap-1 font-semibold text-primary"><X className="h-4 w-4" />Clear</Link>}
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
            <p className="font-semibold">No bikes match those filters</p>
            <Link href="/bikes" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Show all bikes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((b) => <BikeCard key={b.slug} bike={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
