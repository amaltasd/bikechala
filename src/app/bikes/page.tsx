import type { Metadata } from 'next';
import BikeBrowser from '@/components/BikeBrowser';
import { bikes, getBrands, toCard } from '@/lib/bikes';
import { BUDGETS, EMPTY, SORTS, isFiltered, type Filters } from '@/lib/browse';

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

async function filtersFrom(searchParams: SP): Promise<Filters> {
  const sp = await searchParams;
  const budget = one(sp.budget);
  const sort = one(sp.sort);
  return {
    ...EMPTY,
    q: one(sp.q).trim().slice(0, 60),
    budget: BUDGETS.some((b) => b.id === budget) ? budget : '',
    category: one(sp.category),
    fuel: one(sp.fuel),
    brand: one(sp.brand),
    sort: SORTS[sort] ? sort : 'default',
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  return {
    title: 'New Bikes & Scooters in India',
    description: 'Browse every bike and scooter on BikeChala. Filter by budget, brand, type, petrol or electric, and sort by price, power or mileage.',
    alternates: { canonical: '/bikes' },
    robots: isFiltered(await filtersFrom(searchParams)) ? { index: false, follow: true } : undefined,
  };
}

export default async function BikesPage({ searchParams }: { searchParams: SP }) {
  const initial = await filtersFrom(searchParams);
  const brands = getBrands().map(({ slug, name, count }) => ({ slug, name, count }));
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-7">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">New bikes and scooters in India</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ex-showroom prices, Delhi. Tick Compare on any two bikes to see them side by side.</p>
        </div>
      </header>
      <BikeBrowser bikes={bikes.map(toCard)} brands={brands} initial={initial} />
    </div>
  );
}
