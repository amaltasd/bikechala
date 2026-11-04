import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { articles, readingTimeMinutes, formatPublishedDate } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Bike Buying Guides & Articles',
  description: 'Plain-language guides on reading specs, real-world mileage, electric scooters and on-road prices.',
  alternates: { canonical: '/news' },
};

export default function NewsPage() {
  const sorted = [...articles].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Guides &amp; articles</h1>
          <p className="mt-1 text-muted-foreground">Plain-language help for choosing and buying a bike or scooter.</p>
        </div>
      </header>
      <div className="container mx-auto grid max-w-4xl gap-3 px-4 py-5 sm:gap-4">
        {sorted.map((a) => (
          <article key={a.slug} className="group relative rounded-2xl border border-border bg-card p-5 transition-all active:scale-[0.99] sm:hover:shadow-md">
            <p className="text-xs font-semibold text-primary">{a.category}</p>
            <h2 className="mt-1 text-lg font-bold leading-snug group-hover:text-primary sm:text-xl">
              <Link href={`/news/${a.slug}`} className="before:absolute before:inset-0">{a.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
            <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatPublishedDate(a.timestamp)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readingTimeMinutes(a.content)} min read</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
