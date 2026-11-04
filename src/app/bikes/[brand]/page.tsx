import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { bikesByBrand, getBrands, formatPrice } from '@/lib/bikes';

type P = Promise<{ brand: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => getBrands().map((b) => ({ brand: b.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) return { title: 'Brand not found' };
  const name = list[0].brand;
  return {
    title: `${name} Bikes & Scooters in India: Prices & Specs`,
    description: `All ${list.length} ${name} models on BikeChala with specs, mileage and prices where confirmed.`,
    alternates: { canonical: `/bikes/${brand}` },
  };
}

export default async function BrandPage({ params }: { params: P }) {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) notFound();
  const name = list[0].brand;
  const prices = list.map((b) => b.exShowroomPriceInr).filter((p): p is number => p != null);
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-8">
          <Link href="/bikes" className="mb-2 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary"><ChevronLeft className="h-4 w-4" />All bikes</Link>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{name} bikes &amp; scooters</h1>
          <p className="mt-1 text-muted-foreground">
            {list.length} {list.length === 1 ? 'model' : 'models'}{prices.length ? ` · prices from ${formatPrice(Math.min(...prices))}` : ''}
          </p>
        </div>
      </header>
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((b) => <BikeCard key={b.slug} bike={b} />)}
      </div>
    </div>
  );
}
