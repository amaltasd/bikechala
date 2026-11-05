import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { itemListLd } from '@/lib/seo';
import { DATA_UPDATED } from '@/lib/insights';
import { BikeMark } from '@/components/BikeCard';
import { BEST_LISTS, getBestList, bestListBikes, bikeTitle, bikeUrl, formatPrice, keyStats } from '@/lib/bikes';

type P = Promise<{ slug: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => BEST_LISTS.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const l = getBestList(slug);
  if (!l) return { title: 'Not found' };
  const top = bestListBikes(l)[0];
  const lead = top ? ` Top pick: ${bikeTitle(top)} (${l.metric(top) ?? formatPrice(top.exShowroomPriceInr)}).` : '';
  return { title: `${l.title} (${DATA_UPDATED.getFullYear()})`, description: `${l.intro}${lead}`.slice(0, 300), alternates: { canonical: `/best/${slug}` } };
}

export default async function BestPage({ params }: { params: P }) {
  const { slug } = await params;
  const l = getBestList(slug);
  if (!l) notFound();
  const list = bestListBikes(l);

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-4xl px-4 py-4 sm:py-8">
        <Breadcrumbs items={[{ name: 'Bikes', href: '/bikes' }, { name: l.title.replace(' in India', ''), href: `/best/${slug}` }]} />
        <JsonLd data={itemListLd(l.title, list.slice(0, 50).map((b) => ({ name: bikeTitle(b), href: bikeUrl(b) })))} />
        <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{l.h1}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{l.intro}</p>

        <div className="snap-row hide-scrollbar mt-4 gap-2">
          {BEST_LISTS.map((x) => (
            <Link key={x.slug} href={`/best/${x.slug}`} aria-current={x.slug === slug ? 'page' : undefined} className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold active:scale-95 ${x.slug === slug ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary'}`}>
              {x.title.replace(' in India', '')}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-muted-foreground">No bikes match this list yet.</p>
        ) : (
          <ol className="mt-6 space-y-3">
            {list.map((b, i) => (
              <li key={b.slug} className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 active:scale-[0.99] sm:p-4">
                <span className="w-7 shrink-0 text-center font-display text-2xl font-black text-muted-foreground/40">{i + 1}</span>
                <BikeMark bike={b} className="h-14 w-14 shrink-0 rounded-xl text-lg" />
                <div className="min-w-0 flex-1">
                  <Link href={bikeUrl(b)} className="font-bold leading-snug before:absolute before:inset-0 hover:text-primary">{bikeTitle(b)}</Link>
                  <p className="text-xs text-muted-foreground">{keyStats(b).map((s) => s.value).join(' · ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-primary">{l.metric(b)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(b.exShowroomPriceInr) ?? 'Price n/a'}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {list[0] && (
          <p className="mt-4 rounded-xl bg-primary/10 p-3 text-sm"><strong>Top pick:</strong> {bikeTitle(list[0])} ({l.metric(list[0]) ?? formatPrice(list[0].exShowroomPriceInr)}), followed by {list.slice(1, 3).map((b) => bikeTitle(b)).join(' and ')}.</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">Rankings use the figures in our dataset. Bikes with a missing value for the ranked metric are not shown. Prices are ex-showroom and may have changed.</p>
        <div className="mt-6">
          <Faq title="How this list works" faqs={[
            { q: `How is the ${l.title.toLowerCase()} list ranked?`, a: `${l.intro} Only bikes with the needed figure in our data appear, and we do not estimate missing values.` },
            ...(list[0] ? [{ q: `Which is number one on this list?`, a: `The ${bikeTitle(list[0])} ranks first with ${l.metric(list[0]) ?? formatPrice(list[0].exShowroomPriceInr)}.` }] : []),
            { q: 'Are these real-world numbers?', a: 'Mileage and range are manufacturer-claimed test figures and prices are ex-showroom Delhi. Real-world results and on-road prices differ, so treat the ranking as a comparison, not a promise.' },
          ]} />
        </div>
      </div>
    </div>
  );
}
