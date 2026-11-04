'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GitCompare } from 'lucide-react';

export type PickOption = { slug: string; label: string; brand: string };

export default function ComparePicker({ options, initialA = '', initialB = '' }: { options: PickOption[]; initialA?: string; initialB?: string }) {
  const router = useRouter();
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const brands = [...new Set(options.map((o) => o.brand))];

  const select = (value: string, set: (v: string) => void, label: string, other: string) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-foreground">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-3">
        <option value="">Choose a bike…</option>
        {brands.map((br) => (
          <optgroup key={br} label={br}>
            {options.filter((o) => o.brand === br).map((o) => <option key={o.slug} value={o.slug} disabled={o.slug === other}>{o.label}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (a && b && a !== b) router.push(`/compare/${a}-vs-${b}`); }}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      {select(a, setA, 'Bike 1', b)}
      {select(b, setB, 'Bike 2', a)}
      <button disabled={!a || !b || a === b} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground transition-opacity active:scale-95 disabled:opacity-40">
        <GitCompare className="h-4 w-4" /> Compare
      </button>
    </form>
  );
}
