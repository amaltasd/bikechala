import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gauge, IndianRupee, Zap, Route, ArrowRight } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import BrandLogo from '@/components/BrandLogo';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { bikesByBrand, getBrands, formatPrice, brandLogo, bikeTitle, bikeUrl, CATEGORY_LABEL } from '@/lib/bikes';
import { brandFacts, brandFaq } from '@/lib/insights';
import { itemListLd, breadcrumbLd, faqLd, SITE_URL } from '@/lib/seo';

type P = Promise<{ brand: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => getBrands().map((b) => ({ brand: b.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) return { title: 'Brand not found' };
  const name = list[0].brand;
  const f = brandFacts(list);
  const minP = f.cheapest ? formatPrice(f.cheapest.exShowroomPriceInr) : null;
  const maxP = f.dearest ? formatPrice(f.dearest.exShowroomPriceInr) : null;
  const priceRange = minP && maxP && minP !== maxP 
    ? `ranging from ${minP} to ${maxP}` 
    : minP ? `starting at ${minP}` : 'with latest confirmed prices';
  const popular = list.slice(0, 3).map((b) => b.name).join(', ');

  return {
    title: `${name} Bikes in India: Price List 2026, New Models & Offers | BikeChala`,
    description: `Explore ${list.length} new ${name} bikes and scooters in India ${priceRange}. Check 2026 price list, specs, mileage, EV range & offers for popular models like ${popular}.`,
    alternates: { canonical: `/bikes/${brand}` },
    openGraph: {
      title: `${name} Bikes in India: Price List 2026, New Models & Offers`,
      description: `Explore ${list.length} new ${name} models with confirmed ex-showroom prices, mileage, and specs.`,
      url: `${SITE_URL}/bikes/${brand}`,
    },
  };
}

export default async function BrandPage({ params }: { params: P }) {
  const { brand } = await params;
  const list = bikesByBrand(brand);
  if (!list.length) notFound();
  const name = list[0].brand;
  const f = brandFacts(list);
  const evModels = list.filter((b) => b.fuelType === 'electric');
  const cats = [...new Set(list.map((b) => CATEGORY_LABEL[b.category].toLowerCase()))];
  const faqs = brandFaq(name, list);

  const facts = [
    f.cheapest && { icon: IndianRupee, label: 'Lowest price', title: bikeTitle(f.cheapest), value: formatPrice(f.cheapest.exShowroomPriceInr) as string, href: bikeUrl(f.cheapest) },
    f.power && { icon: Gauge, label: 'Most power', title: bikeTitle(f.power), value: `${f.power.powerPs} PS`, href: bikeUrl(f.power) },
    f.mileage && { icon: Route, label: 'Best claimed mileage', title: bikeTitle(f.mileage), value: `${f.mileage.mileageKmpl} km/l`, href: bikeUrl(f.mileage) },
    f.range && { icon: Zap, label: 'Longest claimed range', title: bikeTitle(f.range), value: `${f.range.rangeKm} km`, href: bikeUrl(f.range) },
  ].filter(Boolean) as { icon: typeof Gauge; label: string; title: string; value: string; href: string }[];

  const schemaList = [
    breadcrumbLd([
      { name: 'Home', href: '/' },
      { name: 'Bikes', href: '/bikes' },
      { name: `${name} Bikes`, href: `/bikes/${brand}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name,
      url: `${SITE_URL}/bikes/${brand}`,
      logo: brandLogo(brand)?.src ? `${SITE_URL}${brandLogo(brand)?.src}` : undefined,
    },
    itemListLd(`${name} Bikes and Scooters in India`, list.map((b) => ({ name: bikeTitle(b), href: bikeUrl(b) }))),
    faqLd(faqs),
  ];

  return (
    <div className="flex-1 bg-muted/30 pb-12">
      <JsonLd data={schemaList} />
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-8">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Bikes', href: '/bikes' }, { name: `${name} Bikes`, href: `/bikes/${brand}` }]} />
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {brandLogo(brand) && (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/20 p-2 shadow-sm">
                <BrandLogo brand={name} brandSlug={brand} className="h-12 w-12 shrink-0" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                {name} Bikes in India - Price List 2026, New Models &amp; Offers
              </h1>
              <p className="mt-2 max-w-4xl leading-relaxed text-muted-foreground">
                BikeChala lists {list.length} {name} {list.length === 1 ? 'model' : 'models'} ({cats.join(', ')}).
                {f.cheapest ? ` Prices start at ${formatPrice(f.cheapest.exShowroomPriceInr)} ex-showroom (Delhi) for the ${bikeTitle(f.cheapest)}.` : ' We have not confirmed prices for these models yet.'}
              </p>
            </div>
          </div>
          {facts.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map(({ icon: Icon, label, title, value, href }) => (
                <li key={label}>
                  <Link href={href} className="block h-full rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary active:bg-muted shadow-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
                    <p className="text-lg font-black">{value}</p>
                    <p className="truncate text-xs text-muted-foreground">{title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="container mx-auto max-w-7xl space-y-10 px-4 py-8">
        {/* Position Zero Google Featured Snippet Table */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {name} Bikes Price List (2026) in India
            </h2>
            <p className="text-sm text-muted-foreground">
              Ex-showroom prices (Delhi), displacement or battery capacity, and claimed mileage or range.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{name} Bikes Price List 2026 in India</caption>
              <thead className="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Model</th>
                  <th scope="col" className="px-4 py-3">Ex-Showroom Price</th>
                  <th scope="col" className="px-4 py-3">Displacement / Battery</th>
                  <th scope="col" className="px-4 py-3">Claimed Mileage / Range</th>
                  <th scope="col" className="px-4 py-3 text-right">Specs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((b) => (
                  <tr key={b.slug} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-bold">
                      <Link href={bikeUrl(b)} className="hover:text-primary">
                        {bikeTitle(b)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(b.exShowroomPriceInr) ?? 'Price not confirmed'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.fuelType === 'electric' ? (b.batteryKwh ? `${b.batteryKwh} kWh` : 'Electric') : (b.engineCc ? `${b.engineCc} cc` : '—')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.fuelType === 'electric' ? (b.rangeKm ? `${b.rangeKm} km` : '—') : (b.mileageKmpl ? `${b.mileageKmpl} km/l` : '—')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={bikeUrl(b)} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Popular Models Grid */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Popular {name} Bikes</h2>
              <p className="text-sm text-muted-foreground">All listed {name} models with specs, colors and on-road calculators.</p>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">{list.length} Models</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((b) => <BikeCard key={b.slug} bike={b} />)}
          </div>
        </section>

        {/* Electric Two-Wheelers Section (if applicable) */}
        {evModels.length > 0 && (
          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Electric Two-Wheelers from {name}</h2>
                <p className="text-sm text-muted-foreground">Eco-friendly electric scooters and bikes from {name}.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {evModels.map((b) => <BikeCard key={b.slug} bike={b} />)}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="mx-auto max-w-3xl">
          <Faq faqs={faqs} title={`FAQs about ${name} Bikes`} />
        </section>
      </div>
    </div>
  );
}
