import type { Metadata } from 'next';
import Link from 'next/link';
import ComparePicker from '@/components/ComparePicker';
import { bikes, bikeTitle, CATEGORY_LABEL, type Category } from '@/lib/bikes';

export const metadata: Metadata = {
  title: 'Compare Bikes & Scooters Side by Side',
  description: 'Pick any two bikes or scooters and compare price, power, mileage, range and features in one table.',
  alternates: { canonical: '/compare' },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ComparePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const a = typeof sp.a === 'string' && bikes.some((b) => b.slug === sp.a) ? sp.a : '';
  const options = bikes.map((b) => ({ slug: b.slug, label: bikeTitle(b), brand: b.brand })).sort((x, y) => x.label.localeCompare(y.label));

  // Popular pairs: neighbours by price inside each category (petrol only, price known).
  const pairs: [typeof bikes[number], typeof bikes[number]][] = [];
  for (const cat of ['commuter', 'naked', 'sports', 'cruiser', 'scooter'] as Category[]) {
    const list = bikes.filter((b) => b.category === cat && b.fuelType === 'petrol' && b.exShowroomPriceInr != null).sort((x, y) => x.exShowroomPriceInr! - y.exShowroomPriceInr!);
    for (let i = 0; i + 1 < list.length && pairs.filter((p) => p[0].category === cat).length < 2; i += 2) pairs.push([list[i], list[i + 1]]);
  }
  const ev = bikes.filter((b) => b.fuelType === 'electric' && b.exShowroomPriceInr != null).sort((x, y) => x.exShowroomPriceInr! - y.exShowroomPriceInr!);
  if (ev.length >= 2) pairs.push([ev[0], ev[1]]);

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-6 sm:py-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Compare bikes</h1>
          <p className="mt-1 text-muted-foreground">Pick two bikes to see them side by side. The better value in each row is highlighted.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <ComparePicker options={options} initialA={a} />
        </div>
        <section>
          <h2 className="mb-3 text-lg font-bold">Popular comparisons</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {pairs.map(([x, y]) => (
              <Link key={x.slug + y.slug} href={`/compare/${x.slug}-vs-${y.slug}`} className="rounded-xl border border-border bg-card p-4 active:scale-[0.99] hover:border-primary">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{CATEGORY_LABEL[x.category]}</p>
                <p className="mt-1 font-semibold">{bikeTitle(x)} <span className="text-muted-foreground">vs</span> {bikeTitle(y)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
