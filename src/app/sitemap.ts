import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { bikes, bikeUrl, getBrands, BEST_LISTS } from '@/lib/bikes';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ['/', '/bikes', '/compare', '/tools', '/tools/emi-calculator', '/tools/fuel-cost-calculator', '/tools/on-road-price-calculator', '/news'];
  return [
    ...fixed.map((p) => ({ url: absoluteUrl(p), lastModified: now })),
    ...getBrands().map((b) => ({ url: absoluteUrl(`/bikes/${b.slug}`), lastModified: now })),
    ...bikes.filter((b) => !b.specsPending).map((b) => ({ url: absoluteUrl(bikeUrl(b)), lastModified: now })),
    ...BEST_LISTS.map((l) => ({ url: absoluteUrl(`/best/${l.slug}`), lastModified: now })),
    ...articles.map((a) => ({ url: absoluteUrl(`/news/${a.slug}`), lastModified: new Date(a.timestamp) })),
  ];
}
