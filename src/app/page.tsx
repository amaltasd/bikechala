import Link from 'next/link';
import { ArrowRight, Zap, GitCompare, Calculator, Fuel } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { bikes, getBrands, BEST_LISTS, formatPrice } from '@/lib/bikes';
import { articles } from '@/lib/articles';

export default function Home() {
  const brands = getBrands();
  const popular = ['honda-shine', 'royal-enfield-classic-350', 'tvs-apache-rtr-160-4v', 'bajaj-pulsar-n160', 'ather-rizta', 'hero-splendor-plus']
    .map((s) => bikes.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const fallback = popular.length >= 4 ? popular : bikes.slice(0, 6);
  const cheapest = bikes.filter((b) => b.exShowroomPriceInr != null).sort((a, b) => a.exShowroomPriceInr! - b.exShowroomPriceInr!)[0];

  return (
    <div className="flex-1">
      <section className="border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:py-16">
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Find your next <span className="text-primary">two-wheeler.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {bikes.length} bikes and scooters from {brands.length} brands. Compare specs, check prices and work out what you will really pay.
          </p>
          <form action="/bikes" method="GET" role="search" className="mt-6 flex max-w-xl gap-2">
            <input type="search" name="q" placeholder="Search Splendor, Classic 350, Ather…" aria-label="Search bikes" enterKeyHint="search" className="h-13 min-h-12 flex-1 rounded-xl border border-border bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <button className="min-h-12 rounded-xl bg-primary px-5 font-bold text-primary-foreground active:scale-95">Search</button>
          </form>
          <div className="snap-row hide-scrollbar mt-5 gap-2">
            {BEST_LISTS.map((l) => (
              <Link key={l.slug} href={`/best/${l.slug}`} className="whitespace-nowrap rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold active:scale-95 hover:border-primary hover:text-primary">
                {l.title.replace(' in India', '')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl space-y-12 px-4 py-10">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Popular right now</h2>
            <Link href="/bikes" className="flex items-center gap-1 text-sm font-semibold text-primary">All bikes <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {fallback.map((b) => <BikeCard key={b.slug} bike={b} />)}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Browse by brand</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((b) => (
              <Link key={b.slug} href={`/bikes/${b.slug}`} className="rounded-2xl border border-border bg-card p-4 transition-all active:scale-[0.98] hover:border-primary">
                <p className="font-bold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.count} {b.count === 1 ? 'model' : 'models'}{b.minPrice ? ` · from ${formatPrice(b.minPrice)}` : ''}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { href: '/compare', icon: GitCompare, title: 'Compare bikes', text: 'Two bikes side by side, best value highlighted.' },
            { href: '/tools/emi-calculator', icon: Calculator, title: 'EMI calculator', text: cheapest ? `Plan payments, for example on a ${formatPrice(cheapest.exShowroomPriceInr)} bike.` : 'Plan your monthly payments.' },
            { href: '/tools/fuel-cost-calculator', icon: Fuel, title: 'Running cost', text: 'Petrol or electric, what a month of riding costs.' },
          ].map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 active:scale-[0.99] hover:border-primary">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
              <span><span className="block font-bold">{title}</span><span className="text-sm text-muted-foreground">{text}</span></span>
            </Link>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Zap className="h-6 w-6 text-primary" /> Buying guides</h2>
            <Link href="/news" className="flex items-center gap-1 text-sm font-semibold text-primary">All articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {articles.slice(0, 2).map((a) => (
              <Link key={a.slug} href={`/news/${a.slug}`} className="rounded-2xl border border-border bg-card p-5 active:scale-[0.99] hover:border-primary">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{a.category}</p>
                <p className="mt-1 text-lg font-bold leading-snug">{a.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
