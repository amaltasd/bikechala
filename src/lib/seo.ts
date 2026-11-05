export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bikechala.com').replace(/\/$/, '');
export const SITE_NAME = 'BikeChala';
export const absoluteUrl = (p = '/') => (/^https?:\/\//i.test(p) ? p : `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`);

type Crumb = { name: string; href: string };

export const breadcrumbLd = (items: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
});

export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const itemListLd = (name: string, items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absoluteUrl(it.href) })),
});
