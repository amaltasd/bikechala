import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { itemListLd, absoluteUrl, SITE_NAME } from '@/lib/seo';
import { DATA_UPDATED } from '@/lib/insights';
import { BikeMark } from '@/components/BikeCard';
import { BEST_LISTS, getBestList, bestListBikes, bikeTitle, bikeUrl, formatPrice, keyStats, CATEGORY_LABEL } from '@/lib/bikes';

type P = Promise<{ slug: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => BEST_LISTS.map((l) => ({ slug: l.slug }));

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const l = getBestList(slug);
  if (!l) return { title: 'Not found' };
  const top = bestListBikes(l)[0];
  const topMetric = top ? (l.metric(top) ?? formatPrice(top.exShowroomPriceInr)) : '';
  const lead = top ? ` Top pick: ${bikeTitle(top)} (${topMetric}).` : '';

  const title = `${l.title}${/india/i.test(l.title) ? '' : ' in India'} (${CURRENT_YEAR}): Top 10 Price List`;
  const socialTitle = `${title} | BikeChala`;
  const description = `Discover top-ranked ${l.title.toLowerCase()} in India for ${CURRENT_YEAR}.${lead} Compare confirmed ex-showroom prices, verified ARAI mileage, specs & full buyer rankings.`.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/best/${slug}` },
    openGraph: {
      title: socialTitle,
      description,
      url: absoluteUrl(`/best/${slug}`),
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default async function BestPage({ params }: { params: P }) {
  const { slug } = await params;
  const l = getBestList(slug);
  if (!l) notFound();
  const list = bestListBikes(l);
  const top = list[0];

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Best Bikes', item: absoluteUrl('/best/best-mileage-bikes') },
      { '@type': 'ListItem', position: 3, name: l.title, item: absoluteUrl(`/best/${slug}`) },
    ],
  };

  const faqs = [
    {
      q: `How is the ${l.title.toLowerCase()} list ranked?`,
      a: `${l.intro} Only bikes with verified figures in our official database appear, and we do not use fabricated or estimated values.`,
    },
    ...(top ? [{
      q: `Which model is ranked #1 in ${l.title.toLowerCase()}?`,
      a: `The ${bikeTitle(top)} ranks first with ${l.metric(top) ?? formatPrice(top.exShowroomPriceInr)} ex-showroom in Delhi.`,
    }] : []),
    {
      q: 'Are mileage and range figures real-world numbers?',
      a: 'Mileage and range figures are manufacturer-claimed test numbers under standard ARAI / ICAT driving cycles. Real-world fuel economy is typically 10-15% lower based on city traffic conditions and riding style.',
    },
    {
      q: `What is the price range of ${l.title.toLowerCase()} in India?`,
      a: list.length > 0
        ? `Prices range from ${formatPrice(list[list.length - 1].exShowroomPriceInr) ?? 'budget rates'} up to ${formatPrice(list[0].exShowroomPriceInr) ?? 'premium rates'} depending on displacement and variant features.`
        : 'Prices vary by manufacturer and state RTO registration charges.',
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
      <JsonLd data={itemListLd(l.title, list.slice(0, 50).map((b) => ({ name: bikeTitle(b), href: bikeUrl(b) })))} />

      <div className="container mx-auto max-w-4xl px-4 py-4 sm:py-8">
        <Breadcrumbs
          items={[
            { name: 'Bikes', href: '/bikes' },
            { name: l.title.replace(' in India', ''), href: `/best/${slug}` },
          ]}
        />

        <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-4xl">
          {l.h1} ({CURRENT_YEAR})
        </h1>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
          {l.intro}
        </p>

        {/* Quick Filter Pill Tabs */}
        <div className="snap-row hide-scrollbar mt-5 gap-2">
          {BEST_LISTS.map((x) => (
            <Link
              key={x.slug}
              href={`/best/${x.slug}`}
              aria-current={x.slug === slug ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                x.slug === slug
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {x.title.replace(' in India', '')}
            </Link>
          ))}
        </div>

        {/* Position Zero Google Summary Table */}
        {list.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="border-b border-border p-4 sm:p-5">
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {l.title} (2026) Price &amp; Mileage Summary
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quick comparison table of top models, starting ex-showroom prices, and key performance metrics.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">{l.title} 2026 Price List in India</caption>
                <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3">Rank</th>
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3">Ex-Showroom Price</th>
                    <th scope="col" className="px-4 py-3">{slug.includes('mileage') ? 'Claimed Mileage' : slug.includes('electric') ? 'EV Range' : 'Key Metric'}</th>
                    <th scope="col" className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {list.slice(0, 10).map((b, i) => (
                    <tr key={b.slug} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-extrabold text-muted-foreground">#{i + 1}</td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        <Link href={bikeUrl(b)} className="hover:text-primary">
                          {bikeTitle(b)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatPrice(b.exShowroomPriceInr) ?? 'Price n/a'}
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">
                        {l.metric(b)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={bikeUrl(b)} className="text-xs font-semibold text-primary hover:underline">
                          View Specs
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Detailed Ranked Listing Cards */}
        {list.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-muted-foreground">
            No bikes match this list criteria yet.
          </p>
        ) : (
          <div className="mt-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Complete {l.title} Buyer Rankings
            </h2>
            <ol className="mt-4 space-y-3">
              {list.map((b, i) => (
                <li
                  key={b.slug}
                  className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs transition-all active:scale-[0.99] sm:p-4 hover:border-primary/50"
                >
                  <span className="w-8 shrink-0 text-center font-display text-2xl font-black text-muted-foreground/30">
                    {i + 1}
                  </span>
                  <BikeMark bike={b} className="h-16 w-20 shrink-0 rounded-xl text-lg sm:h-20 sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-primary">
                      {CATEGORY_LABEL[b.category]}
                    </p>
                    <h3 className="font-bold leading-snug">
                      <Link href={bikeUrl(b)} className="before:absolute before:inset-0 hover:text-primary">
                        {bikeTitle(b)}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {keyStats(b).map((s) => s.value).join(' · ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-primary sm:text-lg">
                      {l.metric(b)}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {formatPrice(b.exShowroomPriceInr) ?? 'Price unconfirmed'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {top && (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs sm:text-sm text-foreground/90">
            <strong>Editor&apos;s Recommendation:</strong> {bikeTitle(top)} ranks first with {l.metric(top) ?? formatPrice(top.exShowroomPriceInr)}, followed by {list.slice(1, 3).map((b) => bikeTitle(b)).join(' and ')}.
          </div>
        )}

        {/* FAQs */}
        <div className="mt-8">
          <Faq title={`Frequently Asked Questions on ${l.title}`} faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
