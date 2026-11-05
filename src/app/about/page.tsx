import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { bikes, getBrands } from '@/lib/bikes';
import { DATA_UPDATED, DATA_UPDATED_LABEL } from '@/lib/insights';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Our Data: Sources, Prices and Method',
  description: 'Where BikeChala gets bike prices and specs, what ex-showroom and claimed mean, how we handle unconfirmed numbers, and how often data is updated.',
  alternates: { canonical: '/about' },
};

export default function About() {
  const priced = bikes.filter((b) => b.exShowroomPriceInr != null).length;
  const detailed = bikes.filter((b) => !b.specsPending).length;
  return (
    <div className="flex-1 bg-muted/30 pb-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About BikeChala data', url: absoluteUrl('/about'), dateModified: DATA_UPDATED.toISOString() }} />
      <article className="container mx-auto max-w-3xl px-4 py-5 sm:py-9">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About our data', href: '/about' }]} />
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">How BikeChala gets its data</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          BikeChala covers {bikes.length} bikes and scooters from {getBrands().length} brands in India. {priced} have a confirmed ex-showroom price and {detailed} have confirmed specifications. Data was last updated on {DATA_UPDATED_LABEL}.
        </p>

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
          <h2>Where the numbers come from</h2>
          <p>Prices and specifications are collected from manufacturer websites, official brochures and, where a manufacturer does not publish a figure, established Indian automotive listing sites. Every model page lists the sources used for that model under &ldquo;Where this data comes from&rdquo;.</p>

          <h2>What the terms mean</h2>
          <ul>
            <li><strong>Ex-showroom price</strong> is the price before registration, road tax, insurance and dealer charges. We use the Delhi figure for the starting variant. The on-road price you pay is higher and depends on your state. Our <Link href="/tools/on-road-price-calculator">on-road price calculator</Link> gives an editable estimate.</li>
            <li><strong>Claimed mileage and range</strong> are manufacturer test figures. Real-world results are usually lower, so use them to compare bikes, not to predict your own fuel bill. The <Link href="/tools/fuel-cost-calculator">running-cost calculator</Link> lets you enter your own figure.</li>
          </ul>

          <h2>When we are not sure</h2>
          <p>We do not guess. If we could not confirm a price, the page says &ldquo;Price not confirmed&rdquo; and the bike is left out of any list or filter that depends on price. If we have a price but no confirmed specifications, the page says so and is kept out of search engines until the specs are verified. Models that could not be confirmed on the manufacturer&rsquo;s site, or that are open only for pre-booking, carry a notice.</p>

          <h2>How comparisons and rankings work</h2>
          <p>Rankings and comparisons use only the figures in our data and only compare a value when both bikes have it. Statements such as &ldquo;cheaper by&rdquo; or &ldquo;more power&rdquo; are calculated from those figures. They are not reviews or road tests.</p>

          <h2>Prices change</h2>
          <p>Manufacturers revise prices often. Each model page shows the date its price was recorded. Confirm the final price, offers and availability with an authorised dealer before you buy.</p>

          <h2>Independence</h2>
          <p>BikeChala is not a dealer and does not sell vehicles. Logos and brand names belong to their owners and are used only to identify the bikes.</p>
        </div>
      </article>
    </div>
  );
}
