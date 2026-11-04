import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, GitCompare, Calculator, Fuel, ExternalLink, CheckCircle2, Info, FileText } from 'lucide-react';
import { BikeMark } from '@/components/BikeCard';
import BikeCard from '@/components/BikeCard';
import { absoluteUrl } from '@/lib/seo';
import { bikes, getBike, bikeImage, bikeTitle, bikeUrl, CATEGORY_LABEL, formatPrice, similarBikes, SPEC_FIELDS, specValue } from '@/lib/bikes';

type P = Promise<{ brand: string; model: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => bikes.map((b) => ({ brand: b.brandSlug, model: b.modelSlug }));

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
  const variants = b.variants ?? [];
  const features = b.keyFeatures ?? [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: bikeTitle(b),
    brand: { '@type': 'Brand', name: b.brand },
    category: CATEGORY_LABEL[b.category],
    description: summaryOf(b),
    url: absoluteUrl(bikeUrl(b)),
    ...(b.exShowroomPriceInr != null && { offers: { '@type': 'Offer', priceCurrency: 'INR', price: b.exShowroomPriceInr, availability: 'https://schema.org/InStock' } }),
  };

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-8">
        <Link href={`/bikes/${b.brandSlug}`} className="mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary"><ChevronLeft className="h-4 w-4" />{b.brand}</Link>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex gap-4 p-4 sm:p-6">
            <BikeMark bike={b} className="h-20 w-20 shrink-0 rounded-2xl text-3xl sm:h-28 sm:w-28 sm:text-5xl" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{CATEGORY_LABEL[b.category]}{ev ? ' · Electric' : b.fuelType === 'cng' ? ' · CNG' : ''}</p>
              <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">{bikeTitle(b)}</h1>
              <p className="mt-2 text-xl font-extrabold">
                {price ?? <span className="text-base font-semibold text-muted-foreground">Price not confirmed</span>}
                {price && <span className="ml-1 text-sm font-normal text-muted-foreground">ex-showroom</span>}
              </p>
              {price && b.priceAsOf && <p className="text-xs text-muted-foreground">Price as of: {b.priceAsOf}. Starting variant, Delhi. Confirm with your dealer.</p>}
              {b.priceNote && <p className="mt-1 text-xs text-muted-foreground">{b.priceNote}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-border bg-muted/30 text-center sm:grid-cols-3">
            <Link href={`/compare?a=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold active:bg-muted"><GitCompare className="h-4 w-4 text-primary" />Compare</Link>
            <Link href={`/tools/emi-calculator?bike=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-x border-border py-2 text-xs font-semibold active:bg-muted"><Calculator className="h-4 w-4 text-primary" />EMI</Link>
            <Link href={`/tools/fuel-cost-calculator?bike=${b.slug}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold active:bg-muted"><Fuel className="h-4 w-4 text-primary" />Running cost</Link>
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

        {(b.officialUrl || b.brochureUrl) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {b.officialUrl && <a href={b.officialUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold active:bg-muted"><ExternalLink className="h-4 w-4 text-primary" />{b.officialUrlIsModelPage ? 'Official model page' : 'Manufacturer site'}</a>}
            {b.brochureUrl && <a href={b.brochureUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold active:bg-muted"><FileText className="h-4 w-4 text-primary" />Brochure</a>}
          </div>
        )}

        {img && (
          <figure className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={bikeTitle(b)} fetchPriority="high" decoding="async" className="max-h-[420px] w-full object-cover" />
            {img.credit && <figcaption className="px-4 py-2 text-[11px] text-muted-foreground">Image: {img.credit}</figcaption>}
          </figure>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Overview</h2>
              <p className="mt-2 leading-relaxed text-foreground/85">{summaryOf(b)}</p>
              {b.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {b.highlights.map((h) => <li key={h} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{h}</li>)}
                </ul>
              )}
            </section>

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
    </div>
  );
}
