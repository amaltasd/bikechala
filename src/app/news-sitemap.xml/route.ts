import { articles } from '@/lib/articles';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

// Google News sitemap: only articles from the last 48 hours, as the spec requires.
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = articles.filter((a) => a.timestamp >= cutoff && a.category === 'Market Analysis');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${recent
    .map(
      (a) => `
  <url>
    <loc>${esc(absoluteUrl(`/news/${a.slug}`))}</loc>
    <news:news>
      <news:publication><news:name>${SITE_NAME}</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${new Date(a.timestamp).toISOString()}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 's-maxage=900, stale-while-revalidate' } });
}
