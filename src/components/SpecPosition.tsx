import { CATEGORY_LABEL, formatPrice, type Bike } from '@/lib/bikes';
import { categoryPeers } from '@/lib/insights';

type Metric = { key: keyof Bike; label: string; low?: boolean; show: (v: number) => string; better: string };

const PETROL: Metric[] = [
  { key: 'exShowroomPriceInr', label: 'Price', low: true, show: (v) => formatPrice(v) ?? '', better: 'cheaper than' },
  { key: 'powerPs', label: 'Power', show: (v) => `${v} PS`, better: 'more powerful than' },
  { key: 'mileageKmpl', label: 'Claimed mileage', show: (v) => `${v} km/l`, better: 'more efficient than' },
  { key: 'kerbWeightKg', label: 'Kerb weight', low: true, show: (v) => `${v} kg`, better: 'lighter than' },
];
const EV: Metric[] = [
  { key: 'exShowroomPriceInr', label: 'Price', low: true, show: (v) => formatPrice(v) ?? '', better: 'cheaper than' },
  { key: 'rangeKm', label: 'Claimed range', show: (v) => `${v} km`, better: 'longer range than' },
  { key: 'topSpeedKmph', label: 'Top speed', show: (v) => `${v} km/h`, better: 'faster than' },
  { key: 'batteryKwh', label: 'Battery', show: (v) => `${v} kWh`, better: 'bigger battery than' },
];

/** Where this bike sits among its category peers, from our own data. Hidden when there are too few peers to mean anything. */
export default function SpecPosition({ bike }: { bike: Bike }) {
  const peers = categoryPeers(bike).filter((p) => p.slug !== bike.slug);
  const metrics = (bike.fuelType === 'electric' ? EV : PETROL)
    .map((m) => {
      const v = bike[m.key];
      if (typeof v !== 'number') return null;
      const vals = peers.map((p) => p[m.key]).filter((x): x is number => typeof x === 'number');
      if (vals.length < 5) return null;
      const beaten = vals.filter((x) => (m.low ? x > v : x < v)).length;
      return { m, v, pct: Math.round((beaten / vals.length) * 100), n: vals.length };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (!metrics.length) return null;
  const group = `${CATEGORY_LABEL[bike.category].toLowerCase()}${bike.fuelType === 'electric' ? ' electric' : ''} models`;

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold">How it compares</h2>
      <p className="mt-1 text-sm text-muted-foreground">Against other {group} in our data. A fuller bar means it does better on that measure.</p>
      <ul className="mt-4 space-y-4">
        {metrics.map(({ m, v, pct, n }) => (
          <li key={m.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{m.label}</span>
              <span className="font-bold">{m.show(v)}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${m.label}: ${m.better} ${pct}% of ${n} ${group}`}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(pct, 4)}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{m.better} {pct}% of {n} {group}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
