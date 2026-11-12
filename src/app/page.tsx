import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, GitCompare, Calculator, Fuel, Sparkles } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import BrandLogo from '@/components/BrandLogo';
import { BUDGETS } from '@/lib/browse';
import { bikes, getBrands, BEST_LISTS, formatPrice, brandLogo } from '@/lib/bikes';
import { articles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'New Bikes in India 2026: Prices, Specs, Mileage & Comparisons | BikeChala',
  description: 'Explore all new bikes and scooters in India for 2026. Compare ex-showroom prices, verified mileage, electric range, specs, and calculate EMI & running costs.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'New Bikes in India 2026: Prices, Specs & Comparisons | BikeChala',
    description: 'Find your next two-wheeler. Filter by budget, brand, mileage, and compare models side-by-side.',
    url: 'https://bikechala.com',
  },
};

export default function Home() {
  const brands = getBrands();
  const popular = ['honda-shine', 'royal-enfield-classic-350', 'tvs-apache-rtr-160-4v', 'bajaj-pulsar-n160', 'ather-rizta', 'hero-splendor-plus']
    .map((s) => bikes.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const fallback = popular.length >= 4 ? popular : bikes.slice(0, 6);
  const cheapest = bikes.filter((b) => b.exShowroomPriceInr != null).sort((a, b) => a.exShowroomPriceInr! - b.exShowroomPriceInr!)[0];

  return (
    <div className="flex-1">
      {/* Hero Section with Core SEO H1 */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> India Two-Wheeler Portal 2026
            </span>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              New Bikes in India 2026: Compare Prices, Mileage &amp; Specs
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore {bikes.length} bikes and scooters from {brands.length} manufacturers in India. Honest ex-showroom prices, verified real-world specs, and zero guesswork.
            </p>
          </div>

          {/* Search Box */}
          <form action="/bikes" method="GET" role="search" className="mt-6 flex max-w-2xl gap-2">
            <input
              type="search"
              name="q"
              placeholder="Search by brand or model, e.g. Classic 350, Splendor, Activa, R15"
              aria-label="Search bikes and scooters"
              enterKeyHint="search"
              className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
            <button className="min-h-12 rounded-xl bg-primary px-6 font-bold text-primary-foreground transition-transform active:scale-95">
              Search
            </button>
          </form>

          {/* Category Silo 1: Budget Quick Filters */}
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Browse Bikes by Budget
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BUDGETS.map((b) => {
                const n = bikes.filter((x) => x.exShowroomPriceInr != null && x.exShowroomPriceInr >= b.min && x.exShowroomPriceInr < b.max).length;
                return (
                  <Link
                    key={b.id}
                    href={`/bikes?budget=${b.id}`}
                    className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary active:scale-[0.98] shadow-sm"
                  >
                    <span className="block text-lg font-black leading-tight">{b.label}</span>
                    <span className="mt-1 block text-xs font-semibold text-muted-foreground">{n} bikes available</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Category Silo 2: Curated Best Lists */}
          <div className="mt-6">
            <div className="snap-row hide-scrollbar gap-2">
              {BEST_LISTS.map((l) => (
                <Link
                  key={l.slug}
                  href={`/best/${l.slug}`}
                  className="whitespace-nowrap rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary shadow-xs"
                >
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Silo Funnel Containers */}
      <div className="container mx-auto max-w-7xl space-y-12 px-4 py-10">
        
        {/* Popular Two-Wheelers Section */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Popular Two-Wheelers in India 2026</h2>
              <p className="text-sm text-muted-foreground">Most searched motorcycles and scooters with confirmed prices and specs.</p>
            </div>
            <Link href="/bikes" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              All bikes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallback.map((b) => <BikeCard key={b.slug} bike={b} />)}
          </div>
        </section>

        {/* Brand Silo Links */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Top Two-Wheeler Brands in India</h2>
            <p className="text-sm text-muted-foreground">Explore complete model lineups, 2026 price lists, and specs by manufacturer.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/bikes/${b.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary active:scale-[0.98] shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center">
                  {brandLogo(b.slug) ? (
                    <BrandLogo brand={b.name} brandSlug={b.slug} className="h-10 w-10 transition-transform group-hover:scale-105" />
                  ) : (
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-xs font-bold text-muted-foreground">
                      {b.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-bold group-hover:text-primary">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.count} {b.count === 1 ? 'model' : 'models'}
                </p>
                {b.minPrice && (
                  <p className="mt-1 text-xs font-semibold text-primary">
                    From {formatPrice(b.minPrice)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Buyer Utility Tools Silo */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Essential Two-Wheeler Buying Tools</h2>
            <p className="text-sm text-muted-foreground">Calculate ownership costs, plan financing, and compare two bikes side-by-side.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: '/compare',
                icon: GitCompare,
                title: 'Compare Two-Wheelers',
                text: 'Compare two bikes side-by-side with automatic winner highlights for power, mileage, and weight.',
              },
              {
                href: '/tools/emi-calculator',
                icon: Calculator,
                title: 'Two-Wheeler EMI Calculator',
                text: cheapest ? `Plan monthly instalments starting from ${formatPrice(cheapest.exShowroomPriceInr)}.` : 'Calculate loan EMIs and interest.',
              },
              {
                href: '/tools/fuel-cost-calculator',
                icon: Fuel,
                title: 'Fuel vs Electric Running Cost',
                text: 'Compare petrol monthly fuel bills against home EV charging costs across Indian cities.',
              },
            ].map(({ href, icon: Icon, title, text }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary active:scale-[0.99] shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <span className="block font-bold text-foreground group-hover:text-primary">{title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">{text}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial Guides & Insights */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Zap className="h-6 w-6 text-primary" /> Two-Wheeler Buying Guides &amp; News
              </h2>
              <p className="text-sm text-muted-foreground">In-depth market insights, new launch analyses, and practical rider guides.</p>
            </div>
            <Link href="/news" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              All guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.slice(0, 4).map((a) => (
              <Link
                key={a.slug}
                href={`/news/${a.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary active:scale-[0.99] shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{a.category}</p>
                <p className="mt-2 text-lg font-bold leading-snug group-hover:text-primary">{a.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
