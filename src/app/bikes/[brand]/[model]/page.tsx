import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, GitCompare, Calculator, Fuel, ExternalLink, CheckCircle2, Info, FileText } from 'lucide-react';
import { BikeMark } from '@/components/BikeCard';
import BikeCard from '@/components/BikeCard';
import { absoluteUrl } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import SpecPosition from '@/components/SpecPosition';
import { faqFor, quickAnswer, rivals, DATA_UPDATED, DATA_UPDATED_LABEL, pairSlug } from '@/lib/insights';
import { breadcrumbLd } from '@/lib/seo';
import { bikes, getBike, bikeImage, bikeTitle, bikeUrl, CATEGORY_LABEL, formatPrice, similarBikes, SPEC_FIELDS, specValue } from '@/lib/bikes';

type P = Promise<{ brand: string; model: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => bikes.map((b) => ({ brand: b.brandSlug, model: b.modelSlug }));

/** Example EMI: 10% down, 3 years, 10% a year. Labelled as an example on the page; the EMI tool lets people change it. */
function exampleEmi(price: number) {
  const loan = price * 0.9, r = 0.10 / 12, n = 36;
  return Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

const summaryOf = (b: { summary?: string; brand: string; name: string; category: keyof typeof CATEGORY_LABEL }) =>
  b.summary?.trim() || `${b.brand} ${b.name} is a ${CATEGORY_LABEL[b.category].toLowerCase()} sold in India.`;

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getBike(brand, model);
  if (!b) return { title: 'Bike not found' };
  const price = formatPrice(b.exShowroomPriceInr);
  return {
    title: `${bikeTitle(b)}: ${price ? `Price ${price}, ` : ''}Specs & ${b.fuelType === 'electric' ? 'Range' : 'Mileage'}`,
    description: `${bikeTitle(b)} ${price ? `ex-showroom price ${price}. ` : ''}${summaryOf(b)}`.slice(0, 300),
    alternates: { canonical: bikeUrl(b) },
    // price-only pages have almost no content yet; keep them out of search until specs are confirmed
    robots: b.specsPending ? { index: false, follow: true } : undefined,
  };
}

export default async function BikePage({ params }: { params: P }) {
  const { brand, model } = await params;
  const b = getBike(brand, model);
  if (!b) notFound();

  const price = formatPrice(b.exShowroomPriceInr);
  const rows = SPEC_FIELDS.map((f) => ({ f, v: specValue(b, f) })).filter((r): r is { f: (typeof SPEC_FIELDS)[number]; v: string } => r.v != null && r.f.key !== 'exShowroomPriceInr');
  const similar = similarBikes(b, 4);
  const ev = b.fuelType === 'electric';
  const img = bikeImage(b);
  const official = b.officialSpecs ?? [];
  // a variant row is only worth showing when it carries a price or at least one spec
  const variants = (b.variants ?? []).filter((v) => v.price != null || v.battery || v.range || v.topSpeed || v.charging);
  const features = b.keyFeatures ?? [];

  const faqs = faqFor(b);
  const rv = rivals(b, 3);
  const availability = b.listingStatus === 'prebook' ? 'https://schema.org/PreOrder' : b.listingStatus === 'unverified' ? undefined : 'https://schema.org/InStock';
  const props = rows.slice(0, 12).map((r) => ({ '@type': 'PropertyValue', name: r.f.label, value: r.v }));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    additionalType: 'https://schema.org/Motorcycle',
    name: bikeTitle(b),
    sku: b.slug,
    brand: { '@type': 'Brand', name: b.brand },
    category: CATEGORY_LABEL[b.category],
    description: quickAnswer(b),
    url: absoluteUrl(bikeUrl(b)),
    ...(img && { image: absoluteUrl(img.src) }),
    ...(props.length && { additionalProperty: props }),
    ...(b.exShowroomPriceInr != null && {
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: b.exShowroomPriceInr, url: absoluteUrl(bikeUrl(b)), ...(availability && { availability }), itemCondition: 'https://schema.org/NewCondition' },
    }),
  };

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <JsonLd data={schema} />
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-8">
        <Breadcrumbs items={[{ name: 'Bikes', href: '/bikes' }, { name: b.brand, href: `/bikes/${b.brandSlug}` }, { name: b.name, href: bikeUrl(b) }]} />

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-12 md:items-center">
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-b from-muted/50 via-muted/20 to-background p-4 md:col-span-5 lg:col-span-5">
              {img ? (
                <div className="relative flex w-full flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={bikeTitle(b)}
                    fetchPriority="high"
                    decoding="async"
                    className="max-h-64 w-full object-contain drop-shadow-md sm:max-h-72"
                  />
                  {img.credit && (
                    <span className="mt-2 block text-center text-[10px] text-muted-foreground">
                      Photo: {img.credit}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center">
                  <BikeMark bike={b} className="h-28 w-28 rounded-2xl text-4xl" />
                </div>
              )}
            </div>

            <div className="min-w-0 md:col-span-7 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {CATEGORY_LABEL[b.category]}{ev ? ' · Electric' : b.fuelType === 'cng' ? ' · CNG' : ''}
                </span>
                {b.listingStatus === 'prebook' && (
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">
                    Pre-booking
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {bikeTitle(b)}
              </h1>
              <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                {price ?? <span className="text-base font-semibold text-muted-foreground">Price not confirmed</span>}
                {price && <span className="ml-1 text-sm font-normal text-muted-foreground">ex-showroom</span>}
              </p>
              {b.exShowroomPriceInr != null && (
                <p className="mt-1 text-sm text-foreground/80">
                  EMI from about <span className="font-bold">₹{exampleEmi(b.exShowroomPriceInr).toLocaleString('en-IN')}/month</span>
                  <span className="text-muted-foreground"> (10% down, 3 years, 10% interest). </span>
                  <Link href={`/tools/emi-calculator?bike=${b.slug}`} className="font-semibold text-primary hover:underline">Change it</Link>
                </p>
              )}
              {price && b.priceAsOf && <p className="mt-1 text-xs text-muted-foreground">Price as of: {b.priceAsOf}. Starting variant, Delhi. Confirm with your dealer.</p>}
              {b.priceNote && <p className="mt-1 text-xs text-muted-foreground">{b.priceNote}</p>}

              {(b.officialUrl || b.brochureUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.officialUrl && (
                    <a href={b.officialUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold hover:bg-muted active:bg-muted">
                      <ExternalLink className="h-3.5 w-3.5 text-primary" />
                      {b.officialUrlIsModelPage ? 'Official model page' : 'Manufacturer site'}
                    </a>
                  )}
                  {b.brochureUrl && (
                    <a href={b.brochureUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold hover:bg-muted active:bg-muted">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Brochure
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-border bg-muted/30 text-center sm:grid-cols-3">
            <Link href={`/compare?a=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold hover:bg-muted/60 active:bg-muted"><GitCompare className="h-4 w-4 text-primary" />Compare</Link>
            <Link href={`/tools/emi-calculator?bike=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-x border-border py-2 text-xs font-semibold hover:bg-muted/60 active:bg-muted"><Calculator className="h-4 w-4 text-primary" />EMI</Link>
            <Link href={`/tools/fuel-cost-calculator?bike=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold hover:bg-muted/60 active:bg-muted"><Fuel className="h-4 w-4 text-primary" />Running cost</Link>
          </div>
        </section>

        {(b.listingStatus === 'prebook' || b.listingStatus === 'unverified' || b.specsPending) && (
          <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-foreground/85">
              {b.listingStatus === 'prebook' && 'This model is open for pre-booking; final price and availability may change. '}
              {b.listingStatus === 'unverified' && 'We could not confirm this model is currently listed on the manufacturer\'s site. '}
              {b.specsPending && 'Detailed specifications are still being verified, so we only show what we have confirmed. '}
              Check with an authorised dealer before you decide.
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Overview</h2>
              <p className="mt-2 font-semibold leading-relaxed">{quickAnswer(b)}</p>
              {b.summary?.trim() && <p className="mt-2 leading-relaxed text-foreground/85">{b.summary}</p>}
              <p className="mt-3 text-xs text-muted-foreground">Data last updated <time dateTime={DATA_UPDATED.toISOString().slice(0, 10)}>{DATA_UPDATED_LABEL}</time>. <Link href="/about" className="font-semibold text-primary">How we source our data</Link></p>
              {b.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {b.highlights.map((h) => <li key={h} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{h}</li>)}
                </ul>
              )}
            </section>

            <SpecPosition bike={b} />

            {features.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-lg font-bold">Key features</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {features.map((f) => <li key={f} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>)}
                </ul>
              </section>
            )}

            {rows.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <h2 className="border-b border-border px-5 py-4 text-lg font-bold">Specifications</h2>
              <dl className="divide-y divide-border">
                {rows.map(({ f, v }) => (
                  <div key={f.key as string} className="flex justify-between gap-4 px-5 py-3 text-sm">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Mileage and range are manufacturer-claimed figures. Missing rows mean we could not confirm the value from our sources.</p>
            </section>
            )}

            {official.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <h2 className="border-b border-border px-5 py-4 text-lg font-bold">Official specifications</h2>
                <dl className="divide-y divide-border">
                  {official.map((r) => (
                    <div key={r.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                      <dt className="text-muted-foreground">{r.label}</dt>
                      <dd className="text-right font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                  As listed by the manufacturer{b.officialSpecsSource?.url ? <> (<a href={b.officialSpecsSource.url} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">source</a>)</> : null}. Figures may differ by variant.
                </p>
              </section>
            )}

            {variants.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <h2 className="border-b border-border px-5 py-4 text-lg font-bold">Variants</h2>
                <ul className="divide-y divide-border">
                  {variants.map((v) => (
                    <li key={v.name} className="px-5 py-3 text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{v.name}</span>
                        <span className="shrink-0 font-bold">{formatPrice(v.price) ?? <span className="font-normal text-muted-foreground">Price not confirmed</span>}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{[v.battery, v.range && `Range ${v.range}`, v.topSpeed && `Top speed ${v.topSpeed}`, v.charging].filter(Boolean).join(' · ')}</p>
                      {v.features && <p className="mt-0.5 text-xs text-muted-foreground">{v.features}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {rv.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-lg font-bold">Compare the {b.name} with rivals</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {rv.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/compare/${pairSlug(b.slug, r.slug)}`} className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold active:bg-muted hover:border-primary">
                        <span className="min-w-0 truncate">vs {bikeTitle(r)}</span>
                        <span className="shrink-0 text-xs font-normal text-muted-foreground">{formatPrice(r.exShowroomPriceInr)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Faq faqs={faqs} title={`${bikeTitle(b)}: common questions`} />
          </div>

          <aside className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Similar bikes</h2>
              <div className="mt-3 space-y-3">{similar.map((s) => <BikeCard key={s.slug} bike={s} />)}</div>
            </section>
            {b.sources.length > 0 && (
              <details className="rounded-2xl border border-border bg-card p-5 text-sm">
                <summary className="min-h-8 cursor-pointer font-semibold">Where this data comes from</summary>
                <ul className="mt-3 space-y-2">
                  {b.sources.map((s) => {
                    let host = s;
                    try { host = new URL(s).hostname.replace(/^www\./, ''); } catch {}
                    return <li key={s}><a href={s} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-primary hover:underline">{host}<ExternalLink className="h-3 w-3" /></a></li>;
                  })}
                </ul>
              </details>
            )}
          </aside>
        </div>
      </div>
      <div className="fixed inset-x-0 z-30 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur-md bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{bikeTitle(b)}</p>
            <p className="text-xs text-muted-foreground">{price ? `${price} ex-showroom` : 'Price not confirmed'}</p>
          </div>
          <Link href={`/compare?a=${b.slug}`} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95"><GitCompare className="h-4 w-4" />Compare</Link>
        </div>
      </div>
    </div>
  );
}
