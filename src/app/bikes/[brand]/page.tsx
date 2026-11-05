import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Gauge, IndianRupee, Zap, Route } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import BrandLogo from '@/components/BrandLogo';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { bikesByBrand, getBrands, formatPrice, brandLogo, bikeTitle, bikeUrl, CATEGORY_LABEL } from '@/lib/bikes';
import { brandFacts, brandFaq } from '@/lib/insights';
import { itemListLd } from '@/lib/seo';

type P = Promise<{ brand: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => getBrands().map((b) => ({ brand: b.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) return { title: 'Brand not found' };
  const name = list[0].brand;
  const f = brandFacts(list);
  const from = f.cheapest ? ` Prices start at ${formatPrice(f.cheapest.exShowroomPriceInr)} ex-showroom.` : '';
  return {
    title: `${name} Bikes & Scooters in India: Prices, Specs & Mileage`,
    description: `${list.length} ${name} models with specs, claimed mileage or range and ex-showroom prices where confirmed.${from}`,
    alternates: { canonical: `/bikes/${brand}` },
  };
}

export default async function BrandPage({ params }: { params: P }) {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) notFound();
  const name = list[0].brand;
  const f = brandFacts(list);
  const cats = [...new Set(list.map((b) => CATEGORY_LABEL[b.category].toLowerCase()))];
  const facts = [
    f.cheapest && { icon: IndianRupee, label: 'Lowest price', title: bikeTitle(f.cheapest), value: formatPrice(f.cheapest.exShowroomPriceInr) as string, href: bikeUrl(f.cheapest) },
    f.power && { icon: Gauge, label: 'Most power', title: bikeTitle(f.power), value: `${f.power.powerPs} PS`, href: bikeUrl(f.power) },
    f.mileage && { icon: Route, label: 'Best claimed mileage', title: bikeTitle(f.mileage), value: `${f.mileage.mileageKmpl} km/l`, href: bikeUrl(f.mileage) },
    f.range && { icon: Zap, label: 'Longest claimed range', title: bikeTitle(f.range), value: `${f.range.rangeKm} km`, href: bikeUrl(f.range) },
  ].filter(Boolean) as { icon: typeof Gauge; label: string; title: string; value: string; href: string }[];

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <JsonLd data={itemListLd(`${name} bikes and scooters`, list.map((b) => ({ name: bikeTitle(b), href: bikeUrl(b) })))} />
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-8">
          <Breadcrumbs items={[{ name: 'Bikes', href: '/bikes' }, { name, href: `/bikes/${brand}` }]} />
          <div className="flex items-center gap-3">
            {brandLogo(brand) && <BrandLogo brand={name} brandSlug={brand} className="h-10 w-10 shrink-0" />}
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{name} bikes &amp; scooters</h1>
          </div>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
            BikeChala lists {list.length} {name} {list.length === 1 ? 'model' : 'models'} ({cats.join(', ')}).
            {f.cheapest ? ` Prices start at ${formatPrice(f.cheapest.exShowroomPriceInr)} ex-showroom (Delhi).` : ' We have not confirmed prices for these models yet.'}
          </p>
          {facts.length > 0 && (
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {facts.map(({ icon: Icon, label, title, value, href }) => (
                <li key={label}>
                  <a href={href} className="block h-full rounded-xl border border-border bg-card p-3 active:bg-muted hover:border-primary">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                    <p className="font-extrabold">{value}</p>
                    <p className="truncate text-xs text-muted-foreground">{title}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((b) => <BikeCard key={b.slug} bike={b} />)}
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        <Faq faqs={brandFaq(name, list)} title={`${name}: common questions`} />
      </div>
    </div>
  );
}
