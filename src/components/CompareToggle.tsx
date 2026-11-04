'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCompare } from '@/components/CompareStore';

/** Small "Compare" tick on a bike card. Sits above the card's full-card link. */
export default function CompareToggle({ slug, label }: { slug: string; label: string }) {
  const { has, toggle } = useCompare();
  const [full, setFull] = useState(false);
  const on = has(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from compare` : `Add ${label} to compare`}
      onClick={(e) => {
        e.preventDefault();
        const r = toggle({ slug, label });
        setFull(r === 'full');
        if (r === 'full') setTimeout(() => setFull(false), 2200);
      }}
      className={`absolute right-2 top-2 z-10 flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs font-semibold transition-colors active:scale-95 ${
        on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background/95 text-muted-foreground hover:border-primary hover:text-primary'
      }`}
    >
      {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {full ? 'Max 2 bikes' : on ? 'Added' : 'Compare'}
    </button>
  );
}
