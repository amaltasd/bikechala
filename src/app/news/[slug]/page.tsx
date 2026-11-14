import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, Clock, ListOrdered, ArrowRight } from 'lucide-react';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButton from '@/components/ShareButton';
import { absoluteUrl } from '@/lib/seo';
import { articles, getArticle, readingTimeMinutes, formatPublishedDate, extractHeadings } from '@/lib/articles';

type P = Promise<{ slug: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Article not found' };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/news/${a.slug}` },
    openGraph: { title: a.title, description: a.excerpt, type: 'article', publishedTime: new Date(a.timestamp).toISOString(), ...(a.image ? { images: [absoluteUrl(a.image)] } : {}) },
  };
}

export default async function ArticlePage({ params }: { params: P }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const headings = extractHeadings(a.content);
  const sorted = [...articles].sort((x, y) => y.timestamp - x.timestamp);
  const next = sorted[sorted.findIndex((x) => x.slug === a.slug) + 1] ?? sorted[0];
  let h2 = 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    datePublished: new Date(a.timestamp).toISOString(),
    author: { '@type': 'Organization', name: a.author },
    mainEntityOfPage: absoluteUrl(`/news/${a.slug}`),
  };

  return (
    <div className="flex-1 bg-muted/30 pb-8 pt-3 sm:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ReadingProgress targetId="article-body" />
      <div className="container mx-auto max-w-3xl px-0 sm:px-4">
        <Link href="/news" className="mb-3 ml-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary sm:ml-0"><ChevronLeft className="h-4 w-4" />All articles</Link>

        <article id="article-body" className="overflow-hidden border-y border-border bg-background sm:rounded-2xl sm:border">
          <div className="px-4 py-6 sm:p-8">
            <p className="text-xs font-semibold text-primary">{a.category}</p>
            <h1 className="mt-1 mb-4 text-balance text-[26px] font-extrabold leading-[1.2] tracking-tight sm:text-4xl">{a.title}</h1>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5 text-sm text-muted-foreground">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium text-foreground/80">{a.author}</span>
                <span>{formatPublishedDate(a.timestamp)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{readingTimeMinutes(a.content)} min read</span>
              </p>
              <ShareButton title={a.title} />
            </div>

            {a.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image} alt={a.title} className="mb-6 aspect-[16/9] w-full rounded-xl object-cover" />
            )}

            {headings.length >= 3 && (
              <details className="group mb-7 rounded-xl border border-border bg-muted/40 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-bold">
                  <span className="flex items-center gap-2"><ListOrdered className="h-4 w-4 text-primary" /> In this article</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <ol className="space-y-0.5 px-2 pb-3">
                  {headings.map((h, i) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="flex gap-3 rounded-lg px-2 py-2.5 text-sm text-foreground/80 hover:text-primary active:bg-muted">
                        <span className="w-5 shrink-0 font-bold text-primary/60">{i + 1}</span>{h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-base prose-p:leading-[1.8] prose-p:text-foreground/85 prose-li:text-base prose-li:leading-[1.75] prose-li:text-foreground/85 prose-li:marker:text-primary prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl prose-h2:font-bold prose-h2:text-primary [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: () => null,
                  table: ({ children }) => (
                    <div className="not-prose my-6 overflow-x-auto overscroll-x-contain rounded-xl border border-border">
                      <table className="w-full min-w-[28rem] border-collapse text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:bg-muted/60 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold">{children}</table>
                    </div>
                  ),
                  img: ({ src, alt }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" className="my-6 h-auto w-full rounded-xl" />
                  ),
                  h2: ({ children }) => <h2 id={headings[h2++]?.id}>{children}</h2>,
                }}
              >
                {a.content}
              </ReactMarkdown>
            </div>

            {next && next.slug !== a.slug && (
              <Link href={`/news/${next.slug}`} className="group mt-8 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 active:bg-muted sm:hover:border-primary/50">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-primary">Next article</p>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">{next.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
