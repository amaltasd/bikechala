import type { CardBike, Category } from '@/lib/bike-core';

export type Budget = { id: string; label: string; min: number; max: number };
export const BUDGETS: Budget[] = [
  { id: 'under-1-lakh', label: 'Under ₹1 lakh', min: 0, max: 100000 },
  { id: '1-2-lakh', label: '₹1–2 lakh', min: 100000, max: 200000 },
  { id: '2-5-lakh', label: '₹2–5 lakh', min: 200000, max: 500000 },
  { id: 'above-5-lakh', label: 'Above ₹5 lakh', min: 500000, max: Infinity },
];

export type Filters = { q: string; budget: string; category: string; fuel: string; brand: string; sort: string };
export const EMPTY: Filters = { q: '', budget: '', category: '', fuel: '', brand: '', sort: 'default' };

const power = (b: CardBike) => b.powerPs ?? (b.motorPowerKw ? b.motorPowerKw * 1.36 : 0);
export const SORTS: Record<string, { label: string; fn: (a: CardBike, b: CardBike) => number }> = {
  default: { label: 'Popular brands first', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => (a.exShowroomPriceInr ?? Infinity) - (b.exShowroomPriceInr ?? Infinity) },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => (b.exShowroomPriceInr ?? -1) - (a.exShowroomPriceInr ?? -1) },
  power: { label: 'Most powerful', fn: (a, b) => power(b) - power(a) },
  mileage: { label: 'Best mileage', fn: (a, b) => (b.mileageKmpl ?? 0) - (a.mileageKmpl ?? 0) },
  range: { label: 'Longest range', fn: (a, b) => (b.rangeKm ?? 0) - (a.rangeKm ?? 0) },
};

export function applyFilters(list: CardBike[], f: Filters) {
  const needle = f.q.trim().toLowerCase();
  const budget = BUDGETS.find((b) => b.id === f.budget);
  return list
    .filter((b) =>
      (!f.category || b.category === (f.category as Category)) &&
      (!f.fuel || b.fuelType === f.fuel) &&
      (!f.brand || b.brandSlug === f.brand) &&
      (!budget || (b.exShowroomPriceInr != null && b.exShowroomPriceInr >= budget.min && b.exShowroomPriceInr < budget.max)) &&
      (!needle || `${b.brand} ${b.name} ${b.category}`.toLowerCase().includes(needle)))
    .sort((SORTS[f.sort] ?? SORTS.default).fn);
}

export const isFiltered = (f: Filters) => !!(f.q || f.budget || f.category || f.fuel || f.brand || (f.sort && f.sort !== 'default'));
