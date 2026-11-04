'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Zap } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { CATEGORY_LABEL, type CardBike, type Category } from '@/lib/bike-core';
import { BUDGETS, EMPTY, SORTS, applyFilters, isFiltered, type Filters } from '@/lib/browse';

const PAGE = 48;

export default function BikeBrowser({ bikes, brands, initial }: { bikes: CardBike[]; brands: { slug: string; name: string; count: number }[]; initial: Filters }) {
  const [f, setF] = useState<Filters>(initial);
  const [shown, setShown] = useState(PAGE);
  const first = useRef(true);

  // keep the address bar in step so a filtered view can be shared or reloaded
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v && !(k === 'sort' && v === 'default')) p.set(k, v);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `/bikes?${qs}` : '/bikes');
  }, [f]);

  const set = (patch: Partial<Filters>) => { setF((c) => ({ ...c, ...patch })); setShown(PAGE); };
  const list = useMemo(() => applyFilters(bikes, f), [bikes, f]);
  const cats = useMemo(() => [...new Set(bikes.map((b) => b.category))] as Category[], [bikes]);
  const count = (fn: (b: CardBike) => boolean) => bikes.filter(fn).length;

  const chip = (on: boolean) =>
    `flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors active:scale-95 ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground/80 hover:border-primary hover:text-primary'}`;
  const row = 'snap-row hide-scrollbar scroll-px-4 gap-2 px-4 py-1.5';

  return (
    <>
      <div className="border-b border-border bg-background lg:sticky lg:top-16 lg:z-20 lg:bg-background/95 lg:backdrop-blur-md">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-2 px-4 pt-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="search" value={f.q} onChange={(e) => set({ q: e.target.value.slice(0, 60) })} placeholder="Search by name, e.g. Classic or Ather" aria-label="Search bikes" enterKeyHint="search" className="h-12 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-10 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              {f.q && <button type="button" aria-label="Clear search" onClick={() => set({ q: '' })} className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground active:bg-muted"><X className="h-4 w-4" /></button>}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:contents">
              <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} aria-label="Brand" className="h-12 rounded-xl border border-border bg-background px-3 text-sm">
                <option value="">All brands</option>
                {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name} ({b.count})</option>)}
              </select>
              <select value={f.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort by" className="h-12 rounded-xl border border-border bg-background px-3 text-sm">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className={`${row} pt-2`} role="group" aria-label="Budget">
            <button className={chip(!f.budget)} onClick={() => set({ budget: '' })}>Any budget</button>
            {BUDGETS.map((b) => (
              <button key={b.id} aria-pressed={f.budget === b.id} className={chip(f.budget === b.id)} onClick={() => set({ budget: f.budget === b.id ? '' : b.id })}>{b.label}</button>
            ))}
          </div>
          <div className={`${row} pb-2.5`} role="group" aria-label="Type">
            <button className={chip(!f.category && !f.fuel)} onClick={() => set({ category: '', fuel: '' })}>All types</button>
            <button aria-pressed={f.fuel === 'electric'} className={chip(f.fuel === 'electric')} onClick={() => set({ fuel: f.fuel === 'electric' ? '' : 'electric', category: '' })}>
              <Zap className="h-3.5 w-3.5" />Electric <span className="text-xs opacity-70">{count((b) => b.fuelType === 'electric')}</span>
            </button>
            {cats.map((c) => (
              <button key={c} aria-pressed={f.category === c} className={chip(f.category === c)} onClick={() => set({ category: f.category === c ? '' : c, fuel: '' })}>
                {CATEGORY_LABEL[c]} <span className="text-xs opacity-70">{count((b) => b.category === c)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-4 px-4 py-5">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground" aria-live="polite">
          <p><span className="font-semibold text-foreground">{list.length}</span> {list.length === 1 ? 'bike' : 'bikes'}{f.budget && <> in {BUDGETS.find((b) => b.id === f.budget)?.label.toLowerCase()}</>}</p>
          {isFiltered(f) && <button onClick={() => { setF(EMPTY); setShown(PAGE); }} className="flex min-h-10 items-center gap-1 font-semibold text-primary"><X className="h-4 w-4" />Clear filters</button>}
        </div>
        {f.budget && <p className="-mt-2 text-xs text-muted-foreground">Bikes without a confirmed price are not shown when a budget is selected.</p>}

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
            <p className="font-semibold">No bikes match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a wider budget or remove a filter.</p>
            <button onClick={() => setF(EMPTY)} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Show all bikes</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {list.slice(0, shown).map((b) => <BikeCard key={b.slug} bike={b} />)}
            </div>
            {shown < list.length && (
              <button onClick={() => setShown((n) => n + PAGE)} className="mx-auto flex min-h-12 items-center rounded-xl border border-border bg-background px-6 text-sm font-bold active:bg-muted">Show more ({list.length - shown} left)</button>
            )}
          </>
        )}
      </div>
    </>
  );
}
