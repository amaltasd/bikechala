import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { RunningCostCalculator } from '@/components/Calculators';
import { bikes, bikeTitle } from '@/lib/bikes';

export const metadata: Metadata = {
  title: 'Bike Running Cost Calculator: Petrol vs Electric',
  description: 'Estimate what a month of riding costs, per km, per month and per year, for petrol or electric.',
  alternates: { canonical: '/tools/fuel-cost-calculator' },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const initial = typeof sp.bike === 'string' ? sp.bike : '';
  const options = bikes.map((b) => ({
    slug: b.slug,
    label: bikeTitle(b),
    price: b.exShowroomPriceInr,
    fuelType: (b.fuelType === 'electric' ? 'electric' : 'petrol') as 'electric' | 'petrol',
    mileage: b.mileageKmpl ?? null,
    rangeKm: b.rangeKm ?? null,
    batteryKwh: b.batteryKwh ?? null,
  }));
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-4 sm:py-8">
        <Link href="/tools" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary"><ChevronLeft className="h-4 w-4" />All tools</Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Bike running cost calculator</h1>
          <p className="mt-1 text-muted-foreground">Estimate what a month of riding costs, per km, per month and per year, for petrol or electric.</p>
        </div>
        <RunningCostCalculator bikes={options} initialSlug={initial} />
      </div>
    </div>
  );
}
