'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useCompare } from '@/components/CompareStore';

/** Floats above the bottom tab bar once at least one bike is picked. */
export default function CompareTray() {
  const { picked, remove, clear } = useCompare();
  const path = usePathname() || '/';
  if (!picked.length || path.startsWith('/compare')) return null;
  const ready = picked.length === 2;
  return (
    <div role="region" aria-label="Compare tray" className="fixed inset-x-3 z-[45] mx-auto max-w-xl rounded-2xl border border-border bg-card/95 p-2.5 shadow-2xl backdrop-blur-md bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-4">
      <div className="flex items-center gap-2">
        <ul className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row">
          {picked.map((p) => (
            <li key={p.slug} className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-xl bg-muted px-3 py-1.5 text-sm font-semibold">
              <span className="truncate">{p.label}</span>
              <button type="button" onClick={() => remove(p.slug)} aria-label={`Remove ${p.label}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground active:bg-background"><X className="h-4 w-4" /></button>
            </li>
          ))}
          {!ready && <li className="flex flex-1 items-center rounded-xl border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground">Pick one more bike</li>}
        </ul>
        {ready ? (
          <Link href={`/compare/${picked[0].slug}-vs-${picked[1].slug}`} className="flex min-h-11 shrink-0 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95">Compare</Link>
        ) : (
          <button type="button" onClick={clear} className="min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold text-muted-foreground active:bg-muted">Clear</button>
        )}
      </div>
    </div>
  );
}
