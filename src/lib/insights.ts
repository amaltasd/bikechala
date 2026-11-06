import { bikes, bikeTitle, bikeUrl, formatPrice, CATEGORY_LABEL, keyStats, type Bike } from '@/lib/bikes';

/** Date of the newest price sheet in the data, as an ISO date. Used for "updated" signals and the sitemap. */
export const DATA_UPDATED = (() => {
  const times = bikes.map((b) => (b.priceAsOf ? Date.parse(`${b.priceAsOf} 00:00 +0530`) : NaN)).filter((t) => !Number.isNaN(t));
  return new Date(times.length ? Math.max(...times) : Date.now());
})();
export const DATA_UPDATED_LABEL = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' }).format(DATA_UPDATED);

/**
 * Generated "A vs B" pages are templated, so a brand-new domain should not expose ~120 of them on day one.
 * They stay usable for visitors but are noindex and out of the sitemap until INDEX_COMPARE=true is set
 * (do that about 3 to 4 weeks after launch, once model pages are being indexed and earning impressions).
 */
export const COMPARE_INDEXING = process.env.INDEX_COMPARE === 'true';

const listed = (b: Bike) => !b.specsPending;
const catLower = (b: Bike) => CATEGORY_LABEL[b.category].toLowerCase().replace(' / street', '').replace(' / competition', '');

/** Closest rivals: same category and fuel, nearest price, other brands first. */
export function rivals(b: Bike, n = 3): Bike[] {
  const pool = bikes.filter((x) => x.slug !== b.slug && listed(x) && x.category === b.category && x.fuelType === b.fuelType);
  const p = b.exShowroomPriceInr;
  if (p == null) return pool.filter((x) => x.exShowroomPriceInr != null).slice(0, n);
  return pool
    .filter((x) => x.exShowroomPriceInr != null)
    .map((x) => ({ x, d: Math.abs((x.exShowroomPriceInr as number) - p) + (x.brandSlug === b.brandSlug ? 30000 : 0) }))
    .sort((a, c) => a.d - c.d)
    .slice(0, n)
    .map((r) => r.x);
}

/** Each priced bike paired with its two closest rivals, once per pair, in a fixed slug order (the canonical URL). */
export function curatedPairs(): string[] {
  const set = new Set<string>();
  for (const b of bikes) {
    if (!listed(b) || b.exShowroomPriceInr == null) continue;
    for (const r of rivals(b, 2)) set.add(pairSlug(b.slug, r.slug));
  }
  return [...set];
}
export const pairSlug = (a: string, b: string) => (a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`);

/** One factual sentence that answers "what is this bike?" at a glance. */
export function quickAnswer(b: Bike): string {
  const t = bikeTitle(b);
  const price = formatPrice(b.exShowroomPriceInr);
  const kind = b.fuelType === 'electric' ? `electric ${catLower(b)}` : b.fuelType === 'cng' ? `CNG ${catLower(b)}` : catLower(b);
  const parts: string[] = [];
  if (b.fuelType === 'electric') {
    if (b.batteryKwh) parts.push(`a ${b.batteryKwh} kWh battery`);
    if (b.rangeKm) parts.push(`a claimed range of ${b.rangeKm} km`);
    if (b.topSpeedKmph) parts.push(`a top speed of ${b.topSpeedKmph} km/h`);
  } else {
    if (b.engineCc) parts.push(`a ${b.engineCc} cc engine`);
    if (b.powerPs) parts.push(`${b.powerPs} PS of power`);
    if (b.mileageKmpl) parts.push(`a claimed ${b.mileageKmpl} km/l`);
  }
  const art = /^[aeiou]/i.test(kind) ? 'an' : 'a';
  const withs = parts.length ? `, with ${parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0]}` : '';
  return `The ${t} is ${art} ${kind} ${price ? `priced from ${price} ex-showroom (Delhi)` : 'with no confirmed price yet'}${withs}.`;
}

export function faqFor(b: Bike): { q: string; a: string }[] {
  const t = bikeTitle(b);
  const price = formatPrice(b.exShowroomPriceInr);
  const out: { q: string; a: string }[] = [];
  out.push({
    q: `What is the price of the ${t}?`,
    a: price
      ? `The ${t} starts at ${price} ex-showroom in Delhi${b.priceAsOf ? ` (as of ${b.priceAsOf})` : ''}. The on-road price is higher because it adds registration, road tax and insurance, and it varies by city. Use our on-road price calculator for an estimate, and confirm the final figure with a dealer.`
      : `We have not confirmed an ex-showroom price for the ${t}, so we do not show one. Check the manufacturer's site or an authorised dealer.`,
  });
  if (b.fuelType === 'electric' && b.rangeKm) {
    out.push({ q: `What is the range of the ${t}?`, a: `The claimed range of the ${t} is ${b.rangeKm} km${b.realWorldRangeKm ? `, and we list a real-world figure of about ${b.realWorldRangeKm} km` : ''}. Claimed range is measured on a test cycle; riding speed, load, temperature and traffic usually lower it.` });
  } else if (b.mileageKmpl) {
    out.push({ q: `What is the mileage of the ${t}?`, a: `The claimed mileage of the ${t} is ${b.mileageKmpl} km/l. Real-world figures are usually lower, often by 10 to 20 percent, depending on riding style, load and road conditions.` });
  }
  if (b.fuelType !== 'electric' && b.engineCc) {
    const bits = [`a ${b.engineCc} cc engine`, b.powerPs && `${b.powerPs} PS of power`, b.torqueNm && `${b.torqueNm} Nm of torque`, b.gearbox && `a ${b.gearbox} gearbox`].filter(Boolean) as string[];
    out.push({ q: `What engine does the ${t} have?`, a: `The ${t} has ${bits.join(', ')}.` });
  }
  if (b.fuelType === 'electric' && (b.batteryKwh || b.chargingTime0to80 || b.batteryWarranty)) {
    const bits = [b.batteryKwh && `a ${b.batteryKwh} kWh battery`, b.chargingTime0to80 && `a 0 to 80% charge in ${b.chargingTime0to80}`, b.batteryWarranty && `a battery warranty of ${b.batteryWarranty}`].filter(Boolean) as string[];
    out.push({ q: `What battery and charging does the ${t} have?`, a: `The ${t} has ${bits.join(', ')}.` });
  }
  if (b.kerbWeightKg || b.seatHeightMm) {
    const bits = [b.kerbWeightKg && `a kerb weight of ${b.kerbWeightKg} kg`, b.seatHeightMm && `a seat height of ${b.seatHeightMm} mm`].filter(Boolean) as string[];
    out.push({ q: `What are the weight and seat height of the ${t}?`, a: `The ${t} has ${bits.join(' and ')}.` });
  }
  if (b.abs) out.push({ q: `Does the ${t} have ABS?`, a: `The ${t} is listed with ${b.abs}.` });
  const rv = rivals(b, 3);
  if (rv.length) {
    out.push({
      q: `Which bikes compete with the ${t}?`,
      a: `Closest rivals by category and price are ${rv.map((r) => `${bikeTitle(r)} (${formatPrice(r.exShowroomPriceInr)}${keyStats(r)[0] ? `, ${keyStats(r)[0].value}` : ''})`).join('; ')}.`,
    });
  }
  return out;
}

export function brandFacts(list: Bike[]) {
  const priced = list.filter((b) => b.exShowroomPriceInr != null);
  const cheapest = [...priced].sort((a, b) => (a.exShowroomPriceInr as number) - (b.exShowroomPriceInr as number))[0];
  const dearest = [...priced].sort((a, b) => (b.exShowroomPriceInr as number) - (a.exShowroomPriceInr as number))[0];
  const power = [...list].filter((b) => b.powerPs).sort((a, b) => (b.powerPs as number) - (a.powerPs as number))[0];
  const mileage = [...list].filter((b) => b.mileageKmpl).sort((a, b) => (b.mileageKmpl as number) - (a.mileageKmpl as number))[0];
  const range = [...list].filter((b) => b.rangeKm).sort((a, b) => (b.rangeKm as number) - (a.rangeKm as number))[0];
  return { cheapest, dearest, power, mileage, range };
}

export function brandFaq(name: string, list: Bike[]) {
  const f = brandFacts(list);
  const out: { q: string; a: string }[] = [];
  out.push({ q: `How many ${name} models are on BikeChala?`, a: `BikeChala lists ${list.length} ${name} ${list.length === 1 ? 'model' : 'models'}, across ${[...new Set(list.map((b) => CATEGORY_LABEL[b.category].toLowerCase()))].join(', ')}.` });
  if (f.cheapest) out.push({ q: `What is the cheapest ${name} bike?`, a: `Among ${name} models with a confirmed price, the ${bikeTitle(f.cheapest)} is the cheapest at ${formatPrice(f.cheapest.exShowroomPriceInr)} ex-showroom (Delhi).` });
  if (f.dearest && f.dearest.slug !== f.cheapest?.slug) out.push({ q: `What is the most expensive ${name} bike?`, a: `The ${bikeTitle(f.dearest)} is the most expensive ${name} model we list at ${formatPrice(f.dearest.exShowroomPriceInr)} ex-showroom (Delhi).` });
  if (f.power) out.push({ q: `Which ${name} bike is the most powerful?`, a: `The ${bikeTitle(f.power)} makes the most power in our ${name} data, at ${f.power.powerPs} PS.` });
  if (f.mileage) out.push({ q: `Which ${name} bike has the best mileage?`, a: `The ${bikeTitle(f.mileage)} has the best claimed mileage among ${name} models in our data, at ${f.mileage.mileageKmpl} km/l.` });
  if (f.range) out.push({ q: `Which ${name} model has the longest range?`, a: `The ${bikeTitle(f.range)} has the longest claimed range, at ${f.range.rangeKm} km.` });
  return out;
}

/** Plain-language differences between two bikes, from the data. Only states a difference when both values exist. */
export function compareFacts(a: Bike, b: Bike): string[] {
  const out: string[] = [];
  const A = bikeTitle(a), B = bikeTitle(b);
  const pa = a.exShowroomPriceInr, pb = b.exShowroomPriceInr;
  if (pa != null && pb != null) {
    if (pa === pb) out.push(`Both are priced at ${formatPrice(pa)} ex-showroom.`);
    else out.push(`The ${pa < pb ? A : B} is cheaper by ${formatPrice(Math.abs(pa - pb))}: ${formatPrice(Math.min(pa, pb))} against ${formatPrice(Math.max(pa, pb))} ex-showroom.`);
  }
  const num = (k: keyof Bike, unit: string, word: string, hi = true) => {
    const x = a[k] as number | null | undefined, y = b[k] as number | null | undefined;
    if (typeof x !== 'number' || typeof y !== 'number' || x === y) return;
    const winner = (x > y) === hi ? A : B;
    out.push(`The ${winner} has ${word} (${Math.max(x, y)} ${unit} against ${Math.min(x, y)} ${unit}).`);
  };
  num('powerPs', 'PS', 'more power');
  num('torqueNm', 'Nm', 'more torque');
  num('mileageKmpl', 'km/l', 'better claimed mileage');
  num('rangeKm', 'km', 'longer claimed range');
  num('kerbWeightKg', 'kg', 'lower kerb weight', false);
  return out;
}

export function categoryPeers(b: Bike) {
  return bikes.filter((x) => listed(x) && x.category === b.category && x.fuelType === b.fuelType);
}

export { bikeUrl };
