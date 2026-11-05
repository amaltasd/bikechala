import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import { bikes, getBrands, BEST_LISTS, bikeUrl, bikeTitle } from '@/lib/bikes';
import { articles } from '@/lib/articles';
import { DATA_UPDATED_LABEL } from '@/lib/insights';

export const dynamic = 'force-static';

/** A plain-text map of the site for AI assistants (llmstxt.org format). */
export function GET() {
  const brands = getBrands();
  const detailed = bikes.filter((b) => !b.specsPending);
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> New bikes and scooters in India: ex-showroom prices (Delhi), specs, claimed mileage and range, comparisons and calculators. ${bikes.length} models from ${brands.length} brands. Data last updated ${DATA_UPDATED_LABEL}.`,
    '',
    'Notes for citing this site: prices are ex-showroom Delhi for the starting variant and change often; mileage and range are manufacturer-claimed; where a value is not confirmed we leave it blank rather than estimate.',
    '',
    '## Key pages',
    `- [All bikes](${absoluteUrl('/bikes')}): browse and filter by budget, brand and type`,
    `- [Compare bikes](${absoluteUrl('/compare')}): side-by-side specs`,
    `- [About our data](${absoluteUrl('/about')}): sources, definitions and method`,
    `- [EMI calculator](${absoluteUrl('/tools/emi-calculator')})`,
    `- [Running cost calculator](${absoluteUrl('/tools/fuel-cost-calculator')})`,
    `- [On-road price calculator](${absoluteUrl('/tools/on-road-price-calculator')})`,
    '',
    '## Best-of lists',
    ...BEST_LISTS.map((l) => `- [${l.title}](${absoluteUrl(`/best/${l.slug}`)})`),
    '',
    '## Brands',
    ...brands.map((b) => `- [${b.name}](${absoluteUrl(`/bikes/${b.slug}`)}): ${b.count} models`),
    '',
    '## Guides',
    ...articles.map((a) => `- [${a.title}](${absoluteUrl(`/news/${a.slug}`)}): ${a.excerpt}`),
    '',
    '## Optional: model pages',
    ...detailed.map((b) => `- [${bikeTitle(b)}](${absoluteUrl(bikeUrl(b))})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
