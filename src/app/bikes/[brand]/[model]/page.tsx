import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronRight, 
  GitCompare, 
  Calculator, 
  Fuel, 
  ExternalLink, 
  CheckCircle2, 
  MapPin, 
  FileText,
  Info 
} from 'lucide-react';
import { BikeMark } from '@/components/BikeCard';
import BikeCard from '@/components/BikeCard';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import SpecPosition from '@/components/SpecPosition';
import { faqFor, quickAnswer, rivals, DATA_UPDATED, DATA_UPDATED_LABEL, pairSlug } from '@/lib/insights';
import { 
  bikes, 
  getBike, 
  bikeImage, 
  bikeTitle, 
  bikeUrl, 
  CATEGORY_LABEL, 
  formatPrice, 
  similarBikes,
  SPEC_FIELDS,
  specValue
} from '@/lib/bikes';

type P = Promise<{ brand: string; model: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => bikes.map((b) => ({ brand: b.brandSlug, model: b.modelSlug }));

const CURRENT_YEAR = new Date().getFullYear();

const METRO_CITIES = [
  { city: 'Delhi', rtoPct: 8 },
  { city: 'Mumbai', rtoPct: 10 },
  { city: 'Bengaluru', rtoPct: 12 },
  { city: 'Hyderabad', rtoPct: 9 },
  { city: 'Chennai', rtoPct: 8 },
  { city: 'Pune', rtoPct: 10 },
];

function calculateOnRoad(exShowroom: number, rtoPct: number, engineCc?: number | null, isEv?: boolean) {
  const rto = Math.round((exShowroom * rtoPct) / 100);
  let insurance = 4200;
  if (isEv) {
    insurance = 4500;
  } else if (engineCc && engineCc > 350) {
    insurance = 10800;
  } else if (engineCc && engineCc > 150) {
    insurance = 6800;
  }
  const otherCharges = 1200;
  return { rto, insurance, otherCharges, total: exShowroom + rto + insurance + otherCharges };
}

function exampleEmi(price: number) {
  const loan = price * 0.85;
  const r = 0.105 / 12;
  const n = 36;
  return Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getBike(brand, model);
  if (!b) return { title: 'Bike Not Found' };

  const priceStr = formatPrice(b.exShowroomPriceInr);
  const isEv = b.fuelType === 'electric';
  const effToken = isEv 
    ? (b.rangeKm ? `${b.rangeKm}km Range` : 'Range') 
    : (b.mileageKmpl ? `${b.mileageKmpl}kmpl Mileage` : 'Mileage');
  const emiVal = b.exShowroomPriceInr ? exampleEmi(b.exShowroomPriceInr).toLocaleString('en-IN') : null;

  const metaTitle = priceStr 
    ? `${bikeTitle(b)} Price ${priceStr}, ${effToken} & Specs (${CURRENT_YEAR})`
    : `${bikeTitle(b)} (${CURRENT_YEAR}): Price, Specs & ${effToken}`;
  // metaTitle goes through the site title template (adds " | BikeChala"); OG/Twitter titles do not, so add it there.
  const socialTitle = `${metaTitle} | BikeChala`;

  const metaDescription = `${bikeTitle(b)} price starts at ${priceStr ?? 'competitive rates'} ex-showroom. Check ${effToken}, top city on-road prices, EMI from ${emiVal ? `₹${emiVal}/mo` : 'low rates'}, full specs & rivals.`.slice(0, 160);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: bikeUrl(b) },
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: absoluteUrl(bikeUrl(b)),
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
      images: b.imageUrl ? [{ url: absoluteUrl(b.imageUrl), width: 1200, height: 630, alt: `${bikeTitle(b)} ${CURRENT_YEAR}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: metaDescription,
    },
    robots: b.specsPending ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BikePage({ params }: { params: P }) {
  const { brand, model } = await params;
  const b = getBike(brand, model);
  if (!b) notFound();

  const price = formatPrice(b.exShowroomPriceInr);
  const isEv = b.fuelType === 'electric';
  const img = bikeImage(b);
  const emiMonthly = b.exShowroomPriceInr ? exampleEmi(b.exShowroomPriceInr) : null;
  const similar = similarBikes(b, 4);
  const rv = rivals(b, 4);
  const faqs = faqFor(b);

  const engineSpecs = [
    { label: isEv ? 'Motor Power' : 'Displacement', val: isEv ? (b.motorPowerKw ? `${b.motorPowerKw} kW` : null) : (b.engineCc ? `${b.engineCc} cc` : null) },
    { label: isEv ? 'Battery Capacity' : 'Max Power', val: isEv ? (b.batteryKwh ? `${b.batteryKwh} kWh` : null) : (b.powerPs ? `${b.powerPs} PS` : null) },
    { label: isEv ? 'Battery Warranty' : 'Peak Torque', val: isEv ? b.batteryWarranty : (b.torqueNm ? `${b.torqueNm} Nm` : null) },
    { label: isEv ? 'Charging Time' : 'Transmission', val: isEv ? b.chargingTime0to80 : b.gearbox },
    { label: 'Emission / Tech', val: isEv ? 'Zero Tailpipe Emissions' : 'BS6 Phase 2 (OBD-2 / E20 Compliant)' },
  ].filter((s) => s.val != null);

  const mileageSpecs = [
    { label: isEv ? 'Claimed Range' : 'ARAI Mileage (Claimed)', val: isEv ? (b.rangeKm ? `${b.rangeKm} km` : null) : (b.mileageKmpl ? `${b.mileageKmpl} km/l` : null) },
    { label: isEv ? 'Real-World Range' : 'Estimated City/Highway Mileage', val: isEv ? (b.realWorldRangeKm ? `${b.realWorldRangeKm} km` : null) : (b.mileageKmpl ? `~${Math.round(b.mileageKmpl * 0.85)} km/l` : null) },
    { label: isEv ? 'Top Speed' : 'Fuel Tank Capacity', val: isEv ? (b.topSpeedKmph ? `${b.topSpeedKmph} km/h` : null) : (b.fuelTankL ? `${b.fuelTankL} Litres` : null) },
    { label: isEv ? 'Riding Modes' : 'Riding Range (Full Tank)', val: isEv ? 'Eco / City / Sport' : (b.fuelTankL && b.mileageKmpl ? `~${Math.round(b.fuelTankL * b.mileageKmpl * 0.85)} km` : null) },
  ].filter((s) => s.val != null);

  const brakeSpecs = [
    { label: 'Front Brake', val: b.frontBrake },
    { label: 'Rear Brake', val: b.rearBrake },
    { label: 'Braking Safety (ABS)', val: b.abs ?? 'Combined Braking System (CBS)' },
  ].filter((s) => s.val != null);

  const dimensionSpecs = [
    { label: 'Kerb Weight', val: b.kerbWeightKg ? `${b.kerbWeightKg} kg` : null },
    { label: 'Seat Height', val: b.seatHeightMm ? `${b.seatHeightMm} mm` : null },
    { label: 'Body Style', val: CATEGORY_LABEL[b.category] },
    { label: 'Starting Mechanism', val: b.startType ?? 'Electric / Self Start' },
  ].filter((s) => s.val != null);

  const motorcycleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Motorcycle',
    additionalType: 'https://schema.org/Product',
    name: bikeTitle(b),
    model: b.name,
    sku: b.slug,
    bodyType: CATEGORY_LABEL[b.category],
    fuelType: isEv ? 'Electricity' : b.fuelType === 'cng' ? 'CNG' : 'Petrol',
    meetsEmissionStandard: 'BS6 Phase 2 / OBD-2 Compliant',
    brand: { '@type': 'Brand', name: b.brand },
    description: quickAnswer(b),
    url: absoluteUrl(bikeUrl(b)),
    ...(img && { image: absoluteUrl(img.src) }),
    ...(b.engineCc && { vehicleEngine: { '@type': 'EngineSpecification', engineDisplacement: `${b.engineCc} cc`, enginePower: `${b.powerPs ?? ''} PS` } }),
    ...(b.mileageKmpl && { fuelEfficiency: `${b.mileageKmpl} km/l` }),
    ...(b.kerbWeightKg && { weight: { '@type': 'QuantitativeValue', value: b.kerbWeightKg, unitCode: 'KGM' } }),
    ...(b.exShowroomPriceInr != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: b.exShowroomPriceInr,
        priceValidUntil: `${CURRENT_YEAR}-12-31`,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: absoluteUrl(bikeUrl(b)),
      },
    }),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Bikes', item: absoluteUrl('/bikes') },
      { '@type': 'ListItem', position: 3, name: b.brand, item: absoluteUrl(`/bikes/${b.brandSlug}`) },
      { '@type': 'ListItem', position: 4, name: b.name, item: absoluteUrl(bikeUrl(b)) },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="flex-1 bg-muted/20 pb-12">
      <JsonLd data={motorcycleSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <JsonLd data={faqSchema} />

      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-6">
        <Breadcrumbs 
          items={[
            { name: 'Bikes', href: '/bikes' },
            { name: b.brand, href: `/bikes/${b.brandSlug}` },
            { name: b.name, href: bikeUrl(b) }
          ]} 
        />

        {/* HERO SECTION */}
        <section className="mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-12 md:items-center">
            
            {/* Aspect-Ratio Container: Prevents CLS */}
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-gradient-to-b from-muted/50 via-muted/20 to-background p-4 md:col-span-5">
              {img ? (
                <div className="relative flex w-full flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={`${CURRENT_YEAR} ${bikeTitle(b)} ex-showroom price ${price ?? ''} in India - Studio Profile View`}
                    fetchPriority="high"
                    decoding="async"
                    className="max-h-60 w-full object-contain drop-shadow-md sm:max-h-72"
                  />
                  {/* Minimal Branding Watermark Overlay on Bottom-Right */}
                  <span className="pointer-events-none absolute bottom-1 right-1 flex select-none items-center gap-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[9px] font-semibold text-white/90 shadow-xs backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    bikechala.com
                  </span>
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center">
                  <BikeMark bike={b} className="h-28 w-28 rounded-2xl text-4xl" />
                </div>
              )}
            </div>

            <div className="min-w-0 md:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {CATEGORY_LABEL[b.category]}{isEv ? ' · Electric' : b.fuelType === 'cng' ? ' · CNG' : ' · Petrol'}
                </span>
                <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  BS6 Phase 2 / OBD-2
                </span>
                {b.listingStatus === 'prebook' && (
                  <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                    Pre-booking Open
                  </span>
                )}
              </div>

              {/* Exact-Match Clean H1 */}
              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {bikeTitle(b)}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <p className="text-3xl font-black text-foreground">
                  {price ?? <span className="text-lg font-semibold text-muted-foreground">Price unconfirmed</span>}
                </p>
                {price && <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ex-Showroom Price (Delhi)</span>}
              </div>

              {emiMonthly && (
                <p className="mt-1.5 text-sm text-foreground/80">
                  Estimated EMI: <span className="font-bold text-foreground">₹{emiMonthly.toLocaleString('en-IN')}/month</span>
                  <span className="text-muted-foreground"> (15% down, 36 months @ 10.5%). </span>
                  <Link href={`/tools/emi-calculator?bike=${b.slug}`} className="font-semibold text-primary hover:underline">
                    Customize EMI
                  </Link>
                </p>
              )}

              {/* Fast 4-Pill Specs Strip */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">{isEv ? 'Range' : 'Claimed Mileage'}</span>
                  <p className="text-sm font-bold text-foreground">{isEv ? `${b.rangeKm ?? '--'} km` : `${b.mileageKmpl ?? '--'} km/l`}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">{isEv ? 'Motor Power' : 'Engine'}</span>
                  <p className="text-sm font-bold text-foreground">{isEv ? `${b.motorPowerKw ?? '--'} kW` : `${b.engineCc ?? '--'} cc`}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">Kerb Weight</span>
                  <p className="text-sm font-bold text-foreground">{b.kerbWeightKg ? `${b.kerbWeightKg} kg` : '--'}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">Seat Height</span>
                  <p className="text-sm font-bold text-foreground">{b.seatHeightMm ? `${b.seatHeightMm} mm` : '--'}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href={`/compare?a=${b.slug}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition hover:opacity-95"
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  Compare With Rivals
                </Link>
                <Link
                  href={`/tools/emi-calculator?bike=${b.slug}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-xs font-semibold hover:bg-muted"
                >
                  <Calculator className="h-3.5 w-3.5 text-primary" />
                  EMI Calculator
                </Link>
                <Link
                  href={`/tools/fuel-cost-calculator?bike=${b.slug}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-xs font-semibold hover:bg-muted"
                >
                  <Fuel className="h-3.5 w-3.5 text-primary" />
                  Fuel Cost
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            
            {/* OVERVIEW */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-xl font-bold tracking-tight">
                {bikeTitle(b)} Overview & Key Highlights
              </h2>
              <p className="mt-2 text-base font-semibold leading-relaxed text-foreground">
                {quickAnswer(b)}
              </p>
              {b.summary?.trim() && (
                <p className="mt-2.5 leading-relaxed text-foreground/85">
                  {b.summary}
                </p>
              )}
              
              {b.highlights.length > 0 && (
                <div className="mt-4 rounded-xl bg-muted/40 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What Stands Out</h3>
                  <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {b.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Data verified as of <time dateTime={DATA_UPDATED.toISOString().slice(0, 10)}>{DATA_UPDATED_LABEL}</time>. <Link href="/about" className="font-medium text-primary hover:underline">Editorial sourcing policy</Link>
              </p>
            </section>

            <SpecPosition bike={b} />

            {/* TOP 6 METRO ON-ROAD PRICING TABLE */}
            {b.exShowroomPriceInr && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border p-5">
                  <h2 className="text-xl font-bold tracking-tight">
                    {bikeTitle(b)} On-Road Price in Top Indian Cities ({CURRENT_YEAR})
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estimated on-road price including state RTO registration charges, 5-year third-party + 1-year own damage comprehensive insurance, and standard registration fees.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">City</th>
                        <th className="px-4 py-3">Ex-Showroom</th>
                        <th className="px-4 py-3">RTO (Est.)</th>
                        <th className="px-4 py-3">Insurance</th>
                        <th className="px-5 py-3 font-bold text-foreground">Estimated On-Road</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {METRO_CITIES.map((c) => {
                        const breakdown = calculateOnRoad(b.exShowroomPriceInr!, c.rtoPct, b.engineCc, isEv);
                        return (
                          <tr key={c.city} className="hover:bg-muted/20">
                            <td className="px-5 py-3.5 font-semibold text-foreground">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                {c.city}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">₹{b.exShowroomPriceInr!.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">₹{breakdown.rto.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">₹{breakdown.insurance.toLocaleString('en-IN')}</td>
                            <td className="px-5 py-3.5 font-bold text-foreground">
                              ₹{breakdown.total.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-border bg-muted/10 p-3 text-center text-xs text-muted-foreground">
                  Exact on-road prices vary by dealership and optional accessories. <Link href={`/tools/on-road-price-calculator?bike=${b.slug}`} className="font-semibold text-primary hover:underline">Calculate for custom RTO rates</Link>
                </div>
              </section>
            )}

            {/* CATEGORIZED SPECIFICATIONS */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-xl font-bold tracking-tight">
                {bikeTitle(b)} Full Specifications & Technical Details
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Verified technical specifications structured across engine, efficiency, chassis, and electronic equipment.
              </p>

              {/* H3: Engine & Transmission */}
              {engineSpecs.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                    Engine, Transmission & Performance
                  </h3>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
                    {engineSpecs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground">{s.val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* H3: Mileage & Range */}
              {mileageSpecs.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                    {isEv ? 'Battery, Range & Efficiency' : 'Mileage & Fuel Efficiency'}
                  </h3>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
                    {mileageSpecs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground">{s.val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* H3: Brakes & Suspension */}
              {brakeSpecs.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                    Brakes, Wheels & Suspension
                  </h3>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
                    {brakeSpecs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground">{s.val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* H3: Dimensions & Weight */}
              {dimensionSpecs.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                    Dimensions, Chassis & Weight
                  </h3>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
                    {dimensionSpecs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground">{s.val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>

            {/* VARIANTS MATRIX */}
            {b.variants && b.variants.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border p-5">
                  <h2 className="text-xl font-bold tracking-tight">
                    {bikeTitle(b)} Variants & Prices
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Compare features, braking setups, and price increments across all available trims.
                  </p>
                </div>
                <ul className="divide-y divide-border">
                  {b.variants.map((v) => (
                    <li key={v.name} className="p-4 sm:p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-bold text-foreground sm:text-base">{v.name}</span>
                        <span className="shrink-0 text-base font-extrabold text-primary">
                          {formatPrice(v.price) ?? 'Price unconfirmed'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[v.battery, v.range && `Range ${v.range}`, v.topSpeed && `Top speed ${v.topSpeed}`, v.charging].filter(Boolean).join(' · ')}
                      </p>
                      {v.features && <p className="mt-1 text-xs text-foreground/80">{v.features}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* DIRECT RIVALS */}
            {rv.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="text-xl font-bold tracking-tight">
                  Compare {bikeTitle(b)} with Direct Rivals
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Head-to-head spec and price comparisons with segment competitors.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {rv.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/compare/${pairSlug(b.slug, r.slug)}`}
                      className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border p-3.5 transition hover:border-primary hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold group-hover:text-primary">
                          vs {bikeTitle(r)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(r.exShowroomPriceInr) ?? 'Price unconfirmed'}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            <Faq 
              faqs={faqs} 
              title={`${bikeTitle(b)}: Frequently Asked Questions`} 
            />

          </div>

          {/* ASIDE / SIDEBAR */}
          <aside className="space-y-6 lg:col-span-4">
            
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold tracking-tight">
                Similar {CATEGORY_LABEL[b.category]} Bikes
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Alternative options in the same price range
              </p>
              <div className="mt-4 space-y-3">
                {similar.map((s) => (
                  <BikeCard key={s.slug} bike={s} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 text-sm">
              <h3 className="font-bold text-foreground">Verified Manufacturer Sources</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                All specifications, prices, and claims are cross-checked with official documentation.
              </p>
              <ul className="mt-3 space-y-2">
                {b.officialUrl && (
                  <li>
                    <a
                      href={b.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Manufacturer Model Portal
                    </a>
                  </li>
                )}
                {b.brochureUrl && (
                  <li>
                    <a
                      href={b.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <FileText className="h-3 w-3" />
                      Official Spec Brochure (PDF)
                    </a>
                  </li>
                )}
              </ul>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}
