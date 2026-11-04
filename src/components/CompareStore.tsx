'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Picked = { slug: string; label: string };
type Ctx = { picked: Picked[]; has: (slug: string) => boolean; toggle: (p: Picked) => 'added' | 'removed' | 'full'; remove: (slug: string) => void; clear: () => void };

const KEY = 'bikechala:compare';
const MAX = 2;
const CompareCtx = createContext<Ctx | null>(null);

function read(): Picked[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((x) => x && typeof x.slug === 'string' && typeof x.label === 'string').slice(0, MAX) : [];
  } catch { return []; }
}

/** Up to two bikes picked anywhere on the site, remembered on this device. */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [picked, setPicked] = useState<Picked[]>([]);
  useEffect(() => {
    setPicked(read());
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setPicked(read()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const save = (next: Picked[]) => { setPicked(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };
  const toggle = useCallback((p: Picked): 'added' | 'removed' | 'full' => {
    const cur = read();
    if (cur.some((x) => x.slug === p.slug)) { save(cur.filter((x) => x.slug !== p.slug)); return 'removed'; }
    if (cur.length >= MAX) return 'full';
    save([...cur, p]); return 'added';
  }, []);
  const value = useMemo<Ctx>(() => ({
    picked,
    has: (slug) => picked.some((x) => x.slug === slug),
    toggle,
    remove: (slug) => save(picked.filter((x) => x.slug !== slug)),
    clear: () => save([]),
  }), [picked, toggle]);
  return <CompareCtx.Provider value={value}>{children}</CompareCtx.Provider>;
}

export const useCompare = () => {
  const c = useContext(CompareCtx);
  if (!c) throw new Error('useCompare must be used inside CompareProvider');
  return c;
};
