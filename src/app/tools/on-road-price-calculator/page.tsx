import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { OnRoadCalculator } from '@/components/Calculators';
import { bikes, bikeTitle } from '@/lib/bikes';

export const metadata: Metadata = {
  title: 'On-Road Price Calculator for Bikes',
  description: 'Estimate the on-road price from the ex-showroom price using road tax, insurance and other charges you can edit.',
  alternates: { canonical: '/tools/on-road-price-calculator' },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const initial = typeof sp.bike === 'string' ? sp.bike : '';
  const options = bikes.map((b) => ({
    slug: b.slug,
    label: bikeTitle(b),
    price: b.exShowroomPriceInr,
    fuelType: b.fuelType,
    mileage: b.mileageKmpl ?? null,
    rangeKm: b.rangeKm ?? null,
    batteryKwh: b.batteryKwh ?? null,
  }));
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-4 sm:py-8">
        <Link href="/tools" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary"><ChevronLeft className="h-4 w-4" />All tools</Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">On-road price calculator</h1>
          <p className="mt-1 text-muted-foreground">Estimate the on-road price from the ex-showroom price using road tax, insurance and other charges you can edit.</p>
        </div>
        <OnRoadCalculator bikes={options} initialSlug={initial} />
      </div>
    </div>
  );
}
