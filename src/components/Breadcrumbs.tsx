import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <JsonLd data={breadcrumbLd(items)} />
      <ol className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
            {i === items.length - 1
              ? <span aria-current="page" className="max-w-[16rem] truncate font-semibold text-foreground">{c.name}</span>
              : <Link href={c.href} className="flex min-h-8 items-center font-semibold text-primary">{c.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
