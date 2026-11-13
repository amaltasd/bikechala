import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { COMPARE_INDEXING, compareFacts, curatedPairs, pairSlug } from '@/lib/insights';
import { getBikeBySlug, bikeTitle, bikeUrl, specValue, visibleSpecFields, winners, formatPrice } from '@/lib/bikes';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

type P = Promise<{ pair: string }>;
export const generateStaticParams = () => curatedPairs().map((pair) => ({ pair }));

const CURRENT_YEAR = new Date().getFullYear();

function parse(pair: string) {
  const i = pair.indexOf('-vs-');
  if (i < 1) return null;
  const a = getBikeBySlug(pair.slice(0, i));
  const b = getBikeBySlug(pair.slice(i + 4));
  return a && b && a.slug !== b.slug ? ([a, b] as const) : null;
}

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { pair } = await params;
  const p = parse(pair);
  if (!p) return { title: 'Comparison not found' };
  const [a, b] = p;

  const facts = compareFacts(a, b);
  const factSnippet = facts.slice(0, 2).join(' ');

  const title = `${bikeTitle(a)} vs ${bikeTitle(b)}: Price, Mileage & Specs (${CURRENT_YEAR})`;
  const socialTitle = `${title} | BikeChala`;
  const description = `${factSnippet} Detailed side-by-side comparison on price difference, ARAI mileage, power, dimensions, and our data-backed buyer verdict.`.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/compare/${pairSlug(a.slug, b.slug)}` },
    openGraph: {
      title: socialTitle,
      description,
      url: absoluteUrl(`/compare/${pairSlug(a.slug, b.slug)}`),
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function ComparePair({ params }: { params: P }) {
  const { pair } = await params;
  const p = parse(pair);
  if (!p) notFound();
  const [a, b] = p;
  const list = [a, b];

  const fields = visibleSpecFields(list);
  const wins = Object.fromEntries(list.map((x) => [x.slug, 0])) as Record<string, number>;
  const rows = fields.map((f) => {
    const w = winners(list, f);
    w.forEach((s) => (wins[s] += 1));
    return { f, w };
  });

  const facts = compareFacts(a, b);
  const lead = wins[a.slug] === wins[b.slug] ? null : wins[a.slug] > wins[b.slug] ? a : b;

  // Schema generation
  const productA = {
    '@type': 'Product',
    name: bikeTitle(a),
    url: absoluteUrl(bikeUrl(a)),
    category: a.category,
    isSimilarTo: { '@type': 'Product', name: bikeTitle(b) },
    ...(a.exShowroomPriceInr && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: a.exShowroomPriceInr,
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  const productB = {
    '@type': 'Product',
    name: bikeTitle(b),
    url: absoluteUrl(bikeUrl(b)),
    category: b.category,
    isSimilarTo: { '@type': 'Product', name: bikeTitle(a) },
    ...(b.exShowroomPriceInr && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: b.exShowroomPriceInr,
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: absoluteUrl('/compare') },
      { '@type': 'ListItem', position: 3, name: `${bikeTitle(a)} vs ${bikeTitle(b)}`, item: absoluteUrl(`/compare/${pair}`) },
    ],
  };

  const faqs = [
    {
      q: `Which is cheaper: ${bikeTitle(a)} or ${bikeTitle(b)}?`,
      a: a.exShowroomPriceInr && b.exShowroomPriceInr
        ? a.exShowroomPriceInr < b.exShowroomPriceInr
          ? `${bikeTitle(a)} is cheaper starting at ${formatPrice(a.exShowroomPriceInr)} ex-showroom compared to ${formatPrice(b.exShowroomPriceInr)} for ${bikeTitle(b)}.`
          : `${bikeTitle(b)} is cheaper starting at ${formatPrice(b.exShowroomPriceInr)} ex-showroom compared to ${formatPrice(a.exShowroomPriceInr)} for ${bikeTitle(a)}.`
        : `Check the latest confirmed ex-showroom prices for both models on BikeChala.`,
    },
    {
      q: `Which bike offers better fuel efficiency / range?`,
      a: a.fuelType === 'electric' || b.fuelType === 'electric'
        ? `Compare electric range and charging capabilities in our full spec matrix below.`
        : a.mileageKmpl && b.mileageKmpl
          ? a.mileageKmpl > b.mileageKmpl
            ? `${bikeTitle(a)} delivers higher claimed fuel economy at ${a.mileageKmpl} km/l compared to ${b.mileageKmpl} km/l on ${bikeTitle(b)}.`
            : `${bikeTitle(b)} delivers higher claimed fuel economy at ${b.mileageKmpl} km/l compared to ${a.mileageKmpl} km/l on ${bikeTitle(a)}.`
          : `Mileage claims are based on ARAI testing; check individual city mileage reports.`,
    },
    {
      q: `Which bike should you buy between ${a.name} and ${b.name}?`,
      a: `Choose the ${bikeTitle(a)} if you prioritize ${a.summary ?? 'its distinct styling and riding posture'}. Choose the ${bikeTitle(b)} if you prefer ${b.summary ?? 'its balance of performance and comfort'}.`,
    },
  ];

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
      <JsonLd data={breadcrumbsSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [productA, productB] }} />

      <div className="container mx-auto max-w-4xl px-4 py-4 sm:py-8">
        <Breadcrumbs
          items={[
            { name: 'Compare', href: '/compare' },
            { name: `${bikeTitle(a)} vs ${bikeTitle(b)}`, href: `/compare/${pair}` },
          ]}
        />

        {/* H1 Title */}
        <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-4xl">
          {bikeTitle(a)} <span className="text-primary font-bold">vs</span> {bikeTitle(b)} Comparison
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Detailed head-to-head comparison on price, ARAI mileage, power, dimensions, and real-world rider fit ({CURRENT_YEAR}).
        </p>

        {/* Quick Highlights Strip */}
        {facts.length > 0 && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h2 className="text-base font-bold text-foreground">
              Key Differences at a Glance
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
              {facts.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buyer Persona Split / Quick Verdict (The High-Converting Section) */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Quick Verdict: Which Bike Should You Buy?
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Choose {bikeTitle(a)} if:</p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-foreground/85">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{a.summary ?? `You prefer ${a.brand}'s signature styling and brand character.`}</span>
                </li>
                {a.mileageKmpl && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Delivers {a.mileageKmpl} km/l claimed ARAI fuel efficiency.</span>
                  </li>
                )}
                {a.exShowroomPriceInr && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Starting ex-showroom price at {formatPrice(a.exShowroomPriceInr)}.</span>
                  </li>
                )}
              </ul>
              <Link href={bikeUrl(a)} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Explore {a.name} specs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Choose {bikeTitle(b)} if:</p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-foreground/85">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{b.summary ?? `You prefer ${b.brand}'s distinct comfort and road presence.`}</span>
                </li>
                {b.mileageKmpl && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Delivers {b.mileageKmpl} km/l claimed ARAI fuel efficiency.</span>
                  </li>
                )}
                {b.exShowroomPriceInr && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Starting ex-showroom price at {formatPrice(b.exShowroomPriceInr)}.</span>
                  </li>
                )}
              </ul>
              <Link href={bikeUrl(b)} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Explore {b.name} specs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {lead && (
          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/10 p-4 text-xs font-medium text-foreground/90 sm:text-sm">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span><strong>{bikeTitle(lead)}</strong> leads on more measurable specifications ({wins[lead.slug]} of {rows.filter((r) => r.w.size > 0).length} metric rows). Check seat ergonomics, local service network, and test-ride comfort before booking.</span>
          </p>
        )}

        {/* Specifications Matrix */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="border-b border-border p-4 sm:p-5">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Side-by-Side Specifications Comparison Matrix
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct comparison of engine displacement, power output, kerb weight, braking, and fuel tank capacity.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="sticky top-14 z-10 grid grid-cols-[100px_1fr_1fr] border-b border-border bg-card/95 backdrop-blur-md sm:grid-cols-[160px_1fr_1fr] lg:top-16">
              <div className="p-3 text-xs font-bold uppercase text-muted-foreground">Spec</div>
              {list.map((x) => (
                <Link key={x.slug} href={bikeUrl(x)} className="border-l border-border p-3 text-sm font-bold leading-snug hover:text-primary">
                  <span className="text-xs font-semibold text-primary">{x.brand}</span>
                  <span className="block text-foreground">{x.name}</span>
                </Link>
              ))}
            </div>

            {rows.map(({ f, w }) => (
              <div key={f.key as string} className="grid grid-cols-[100px_1fr_1fr] border-b border-border text-sm last:border-b-0 sm:grid-cols-[160px_1fr_1fr]">
                <div className="bg-muted/40 p-3 text-xs font-semibold text-muted-foreground">{f.label}</div>
                {list.map((x) => {
                  const v = specValue(x, f);
                  const win = w.has(x.slug);
                  return (
                    <div key={x.slug} className={`border-l border-border p-3 ${win ? 'bg-primary/10 font-bold text-primary' : 'text-foreground'}`}>
                      {v ?? <span className="text-muted-foreground">—</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions: {bikeTitle(a)} vs {bikeTitle(b)}
          </h2>
          <div className="mt-3 space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
