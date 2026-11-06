import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { bikes, bikeUrl, getBrands, BEST_LISTS } from '@/lib/bikes';
import { articles } from '@/lib/articles';
import { COMPARE_INDEXING, curatedPairs, DATA_UPDATED } from '@/lib/insights';

export default function sitemap(): MetadataRoute.Sitemap {
  // Dates come from the data, not from "now": a sitemap that always says "changed today" is learned and ignored.
  const d = DATA_UPDATED;
  const fixed = ['/', '/bikes', '/compare', '/tools', '/tools/emi-calculator', '/tools/fuel-cost-calculator', '/tools/on-road-price-calculator', '/news', '/about'];
  return [
    ...fixed.map((p) => ({ url: absoluteUrl(p), lastModified: d, priority: p === '/' ? 1 : 0.7 })),
    ...getBrands().map((b) => ({ url: absoluteUrl(`/bikes/${b.slug}`), lastModified: d, priority: 0.8 })),
    ...bikes.filter((b) => !b.specsPending).map((b) => ({ url: absoluteUrl(bikeUrl(b)), lastModified: d, priority: 0.9 })),
    ...BEST_LISTS.map((l) => ({ url: absoluteUrl(`/best/${l.slug}`), lastModified: d, priority: 0.8 })),
    ...(COMPARE_INDEXING ? curatedPairs() : []).map((p) => ({ url: absoluteUrl(`/compare/${p}`), lastModified: d, priority: 0.6 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/news/${a.slug}`), lastModified: new Date(a.timestamp), priority: 0.6 })),
  ];
}
