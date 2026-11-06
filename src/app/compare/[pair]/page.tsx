import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { COMPARE_INDEXING, compareFacts, curatedPairs, pairSlug } from '@/lib/insights';
import { getBikeBySlug, bikeTitle, bikeUrl, specValue, visibleSpecFields, winners } from '@/lib/bikes';

type P = Promise<{ pair: string }>;
export const generateStaticParams = () => curatedPairs().map((pair) => ({ pair }));

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
  return {
    title: `${bikeTitle(p[0])} vs ${bikeTitle(p[1])}: Price, Specs & Mileage`,
    description: `${compareFacts(p[0], p[1]).slice(0, 3).join(' ')} Compare ${bikeTitle(p[0])} and ${bikeTitle(p[1])} side by side on price, power, mileage or range, weight and features.`.slice(0, 300),
    alternates: { canonical: `/compare/${pairSlug(p[0].slug, p[1].slug)}` },
    robots: COMPARE_INDEXING ? undefined : { index: false, follow: true },
  };
}

export default async function ComparePair({ params }: { params: P }) {
  const { pair } = await params;
  const p = parse(pair);
  if (!p) notFound();
  const list = [...p];
  const fields = visibleSpecFields(list);
  const wins = Object.fromEntries(list.map((b) => [b.slug, 0])) as Record<string, number>;
  const rows = fields.map((f) => {
    const w = winners(list, f);
    w.forEach((s) => (wins[s] += 1));
    return { f, w };
  });
  const [a, b] = list;
  const facts = compareFacts(a, b);
  const lead = wins[a.slug] === wins[b.slug] ? null : wins[a.slug] > wins[b.slug] ? a : b;

  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-4xl px-4 py-4 sm:py-8">
        <Breadcrumbs items={[{ name: 'Compare', href: '/compare' }, { name: `${bikeTitle(a)} vs ${bikeTitle(b)}`, href: `/compare/${pair}` }]} />
        <h1 className="text-xl font-black leading-tight tracking-tight sm:text-3xl">{bikeTitle(a)} <span className="text-muted-foreground">vs</span> {bikeTitle(b)}</h1>

        {facts.length > 0 && (
          <ul className="mt-3 space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">
            {facts.map((f) => <li key={f} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{f}</li>)}
          </ul>
        )}

        {lead && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-primary/10 p-3 text-sm">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span><strong>{bikeTitle(lead)}</strong> leads on more specs ({wins[lead.slug]} of {rows.filter((r) => r.w.size > 0).length} measurable rows). That is a count, not a verdict: check ride feel, service access and what matters to you.</span>
          </p>
        )}

        <div className="mt-4 overflow-clip rounded-2xl border border-border bg-card">
          <div className="sticky top-14 z-10 grid grid-cols-[96px_1fr_1fr] border-b border-border bg-card/95 backdrop-blur sm:grid-cols-[160px_1fr_1fr] lg:top-16">
            <div />
            {list.map((x) => (
              <Link key={x.slug} href={bikeUrl(x)} className="border-l border-border p-3 text-sm font-bold leading-snug hover:text-primary">
                <span className="text-xs font-semibold text-primary">{x.brand}</span>
                <span className="block">{x.name}</span>
              </Link>
            ))}
          </div>
          {rows.map(({ f, w }) => (
            <div key={f.key as string} className="grid grid-cols-[96px_1fr_1fr] border-b border-border text-sm last:border-b-0 sm:grid-cols-[160px_1fr_1fr]">
              <div className="bg-muted/40 p-3 text-xs font-semibold text-muted-foreground">{f.label}</div>
              {list.map((x) => {
                const v = specValue(x, f);
                const win = w.has(x.slug);
                return (
                  <div key={x.slug} className={`border-l border-border p-3 ${win ? 'bg-primary/10 font-bold text-primary' : ''}`}>
                    {v ?? <span className="text-muted-foreground">—</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">“—” means we could not confirm that value. Mileage and range are manufacturer-claimed. Prices are ex-showroom, Delhi, and may be out of date.</p>
      </div>
    </div>
  );
}
