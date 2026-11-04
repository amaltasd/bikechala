import raw from '@/data/bikes.json';
import { type Bike, type Category, formatPrice } from './bike-core';
export * from './bike-core';

export const bikes = raw as unknown as Bike[];

export function getBike(brandSlug: string, modelSlug: string) {
  return bikes.find((b) => b.brandSlug === brandSlug && b.modelSlug === modelSlug);
}
export const getBikeBySlug = (slug: string) => bikes.find((b) => b.slug === slug);

export function getBrands() {
  const map = new Map<string, { slug: string; name: string; count: number; minPrice: number | null }>();
  for (const b of bikes) {
    const cur = map.get(b.brandSlug) ?? { slug: b.brandSlug, name: b.brand, count: 0, minPrice: null };
    cur.count += 1;
    if (b.exShowroomPriceInr != null) cur.minPrice = cur.minPrice == null ? b.exShowroomPriceInr : Math.min(cur.minPrice, b.exShowroomPriceInr);
    map.set(b.brandSlug, cur);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export const bikesByBrand = (brandSlug: string) => bikes.filter((b) => b.brandSlug === brandSlug);

/** Same category and fuel first, then closest in price; excludes the bike itself. */
export function similarBikes(bike: Bike, n = 4) {
  const price = bike.exShowroomPriceInr;
  return bikes
    .filter((b) => b.slug !== bike.slug)
    .map((b) => {
      let score = 0;
      if (b.category === bike.category) score += 4;
      if (b.fuelType === bike.fuelType) score += 2;
      if (price != null && b.exShowroomPriceInr != null) score += 3 - Math.min(3, Math.abs(b.exShowroomPriceInr - price) / 40000);
      return { b, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.b);
}

export type SpecField = {
  key: keyof Bike;
  label: string;
  unit?: string;
  /** which direction wins in a comparison */
  better?: 'high' | 'low';
  format?: (v: number) => string;
};

export const SPEC_FIELDS: SpecField[] = [
  { key: 'exShowroomPriceInr', label: 'Ex-showroom price', better: 'low', format: (v) => formatPrice(v) ?? '' },
  { key: 'engineCc', label: 'Engine', unit: 'cc' },
  { key: 'powerPs', label: 'Power', unit: 'PS', better: 'high' },
  { key: 'torqueNm', label: 'Torque', unit: 'Nm', better: 'high' },
  { key: 'mileageKmpl', label: 'Mileage (claimed)', unit: 'km/l', better: 'high' },
  { key: 'batteryKwh', label: 'Battery', unit: 'kWh', better: 'high' },
  { key: 'rangeKm', label: 'Range (claimed)', unit: 'km', better: 'high' },
  { key: 'realWorldRangeKm', label: 'Range (real-world)', unit: 'km', better: 'high' },
  { key: 'motorPowerKw', label: 'Motor power', unit: 'kW', better: 'high' },
  { key: 'topSpeedKmph', label: 'Top speed', unit: 'km/h', better: 'high' },
  { key: 'chargingTime0to80', label: 'Charging 0–80%' },
  { key: 'gearbox', label: 'Gearbox' },
  { key: 'fuelTankL', label: 'Fuel tank', unit: 'L', better: 'high' },
  { key: 'kerbWeightKg', label: 'Kerb weight', unit: 'kg', better: 'low' },
  { key: 'seatHeightMm', label: 'Seat height', unit: 'mm' },
  { key: 'frontBrake', label: 'Front brake' },
  { key: 'rearBrake', label: 'Rear brake' },
  { key: 'abs', label: 'ABS' },
  { key: 'startType', label: 'Start' },
  { key: 'batteryWarranty', label: 'Battery warranty' },
];

export function specValue(b: Bike, f: SpecField): string | null {
  const v = b[f.key];
  if (v == null || v === '') return null;
  if (typeof v === 'number') return f.format ? f.format(v) : `${v.toLocaleString('en-IN')}${f.unit ? ` ${f.unit}` : ''}`;
  return String(v);
}

/** Fields where at least one of the given bikes has a value. */
export function visibleSpecFields(list: Bike[]) {
  return SPEC_FIELDS.filter((f) => list.some((b) => specValue(b, f) != null));
}

/** Slugs of the bikes with the best value for a field (ties allowed). */
export function winners(list: Bike[], f: SpecField) {
  if (!f.better) return new Set<string>();
  const vals = list.filter((b) => typeof b[f.key] === 'number').map((b) => ({ s: b.slug, v: b[f.key] as number }));
  if (vals.length < 2) return new Set<string>();
  const best = f.better === 'high' ? Math.max(...vals.map((x) => x.v)) : Math.min(...vals.map((x) => x.v));
  if (vals.every((x) => x.v === best)) return new Set<string>();
  return new Set(vals.filter((x) => x.v === best).map((x) => x.s));
}

/** Curated, data-driven "best of" lists. Bikes without a confirmed price never appear in price-based lists. */
export type BestList = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  pick: (b: Bike) => boolean;
  sort: (a: Bike, b: Bike) => number;
  metric: (b: Bike) => string | null;
};

const price = (b: Bike) => b.exShowroomPriceInr ?? Infinity;

export const BEST_LISTS: BestList[] = [
  {
    slug: 'best-mileage-bikes',
    title: 'Best Mileage Bikes in India',
    h1: 'Best mileage bikes in India',
    intro: 'Petrol bikes and scooters ranked by claimed ARAI mileage. Real-world figures are usually 10–20% lower, so treat these as a comparison, not a promise.',
    pick: (b) => b.fuelType === 'petrol' && !!b.mileageKmpl,
    sort: (a, b) => (b.mileageKmpl ?? 0) - (a.mileageKmpl ?? 0),
    metric: (b) => (b.mileageKmpl ? `${b.mileageKmpl} km/l` : null),
  },
  {
    slug: 'best-bikes-under-1-lakh',
    title: 'Best Bikes Under ₹1 Lakh',
    h1: 'Best bikes under ₹1 lakh',
    intro: 'Ex-showroom prices under ₹1,00,000, cheapest first. Bikes whose price we could not confirm are left out rather than guessed.',
    pick: (b) => b.exShowroomPriceInr != null && b.exShowroomPriceInr < 100000,
    sort: (a, b) => price(a) - price(b),
    metric: (b) => formatPrice(b.exShowroomPriceInr),
  },
  {
    slug: 'best-bikes-under-2-lakh',
    title: 'Best Bikes Under ₹2 Lakh',
    h1: 'Best bikes under ₹2 lakh',
    intro: 'Everything with a confirmed ex-showroom price under ₹2,00,000, sorted by power so the quickest options come first.',
    pick: (b) => b.exShowroomPriceInr != null && b.exShowroomPriceInr < 200000 && b.fuelType === 'petrol',
    sort: (a, b) => (b.powerPs ?? 0) - (a.powerPs ?? 0),
    metric: (b) => formatPrice(b.exShowroomPriceInr),
  },
  {
    slug: 'best-electric-scooters',
    title: 'Best Electric Scooters in India',
    h1: 'Best electric scooters and bikes in India',
    intro: 'Electric two-wheelers ranked by claimed range. Certified range is measured under test conditions; city riding with traffic gives less.',
    pick: (b) => b.fuelType === 'electric' && !!b.rangeKm,
    sort: (a, b) => (b.rangeKm ?? 0) - (a.rangeKm ?? 0),
    metric: (b) => (b.rangeKm ? `${b.rangeKm} km` : null),
  },
  {
    slug: 'best-scooters',
    title: 'Best Scooters in India',
    h1: 'Best petrol scooters in India',
    intro: 'Petrol scooters with a known mileage figure, most efficient first.',
    pick: (b) => b.category === 'scooter' && b.fuelType === 'petrol' && !!b.mileageKmpl,
    sort: (a, b) => (b.mileageKmpl ?? 0) - (a.mileageKmpl ?? 0),
    metric: (b) => (b.mileageKmpl ? `${b.mileageKmpl} km/l` : null),
  },
  {
    slug: 'best-cruiser-and-adventure-bikes',
    title: 'Best Cruiser & Adventure Bikes in India',
    h1: 'Best cruiser and adventure bikes in India',
    intro: 'Relaxed highway cruisers and adventure tourers, sorted by engine size.',
    pick: (b) => b.category === 'cruiser' || b.category === 'adventure',
    sort: (a, b) => (b.engineCc ?? 0) - (a.engineCc ?? 0),
    metric: (b) => (b.engineCc ? `${b.engineCc} cc` : null),
  },
];

export const getBestList = (slug: string) => BEST_LISTS.find((l) => l.slug === slug);
export const bestListBikes = (l: BestList) => bikes.filter(l.pick).sort(l.sort);

