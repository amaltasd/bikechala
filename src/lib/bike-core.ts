import imageMap from '@/data/images.json';
import logoMap from '@/data/brand-logos.json';

export type Category = 'commuter' | 'sports' | 'naked' | 'cruiser' | 'adventure' | 'scooter' | 'off-road';
type N = number | null | undefined;
type S = string | null | undefined;

export type Bike = {
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  modelSlug: string;
  category: Category;
  fuelType: 'petrol' | 'electric' | 'cng';
  engineCc?: N;
  powerPs?: N;
  torqueNm?: N;
  mileageKmpl?: N;
  gearbox?: S;
  fuelTankL?: N;
  startType?: S;
  batteryKwh?: N;
  rangeKm?: N;
  realWorldRangeKm?: N;
  motorPowerKw?: N;
  topSpeedKmph?: N;
  chargingTime0to80?: S;
  batteryWarranty?: S;
  priceNote?: S;
  kerbWeightKg?: N;
  seatHeightMm?: N;
  frontBrake?: S;
  rearBrake?: S;
  abs?: S;
  exShowroomPriceInr: number | null;
  priceAsOf?: S;
  highlights: string[];
  summary: string;
  sources: string[];
  /** true when we have a price but no confirmed specs yet */
  specsPending?: boolean;
  listingStatus?: 'listed' | 'unverified' | 'prebook';
  officialUrl?: S;
  officialUrlIsModelPage?: boolean;
  brochureUrl?: S;
  imageUrl?: S;
  officialSpecs?: { label: string; value: string }[];
  officialSpecsSource?: { url?: S; status?: S } | null;
  keyFeatures?: string[];
  variants?: { name: string; price?: N; battery?: S; range?: S; topSpeed?: S; charging?: S; features?: S; sourceUrl?: S }[];
};

type ImageEntry = { src: string; credit?: string; sourceUrl?: string };
const images = imageMap as unknown as Record<string, ImageEntry>;
/** Locally stored photo for a bike, if scripts/fetch-images.mjs has downloaded one. */
export const bikeImage = (b: Pick<Bike, 'slug'>) => images[b.slug] ?? null;

export const CATEGORY_LABEL: Record<Category, string> = {
  commuter: 'Commuter',
  sports: 'Sports',
  naked: 'Naked / Street',
  cruiser: 'Cruiser',
  adventure: 'Adventure',
  scooter: 'Scooter',
  'off-road': 'Off-road / competition',
};

export const bikeTitle = (b: Pick<Bike, 'brand' | 'name'>) => `${b.brand} ${b.name}`;
export const bikeUrl = (b: Pick<Bike, 'brandSlug' | 'modelSlug'>) => `/bikes/${b.brandSlug}/${b.modelSlug}`;

/** ₹59,477 below a lakh, ₹1.66 Lakh above, ₹1.2 Cr above a crore. */
export function formatPrice(n: N) {
  if (n == null) return null;
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} Lakh`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export const priceLabel = (b: Pick<Bike, 'exShowroomPriceInr'>) => formatPrice(b.exShowroomPriceInr) ?? 'Price not confirmed';

/** The one or two numbers that best describe a bike on a card. */
export function keyStats(b: CardBike): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  if (b.fuelType === 'electric') {
    if (b.rangeKm) out.push({ label: 'Range', value: `${b.rangeKm} km` });
    if (b.batteryKwh) out.push({ label: 'Battery', value: `${b.batteryKwh} kWh` });
    if (out.length < 2 && b.topSpeedKmph) out.push({ label: 'Top speed', value: `${b.topSpeedKmph} km/h` });
  } else {
    if (b.engineCc) out.push({ label: 'Engine', value: `${b.engineCc} cc` });
    if (b.mileageKmpl) out.push({ label: 'Mileage', value: `${b.mileageKmpl} km/l` });
    if (out.length < 2 && b.powerPs) out.push({ label: 'Power', value: `${b.powerPs} PS` });
  }
  return out.slice(0, 2);
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

type LogoEntry = { src: string; mono?: boolean; credit?: string };
const logos = logoMap as unknown as Record<string, LogoEntry>;
/** Brand logo from src/data/brand-logos.json, or null when we do not have one yet. */
export const brandLogo = (brandSlug: string) => logos[brandSlug] ?? null;

/** The few fields a list card and the filters need; small enough to send to the browser for all bikes. */
export const CARD_FIELDS = ['slug', 'brand', 'brandSlug', 'name', 'modelSlug', 'category', 'fuelType', 'engineCc', 'powerPs', 'mileageKmpl', 'rangeKm', 'batteryKwh', 'topSpeedKmph', 'motorPowerKw', 'exShowroomPriceInr', 'listingStatus'] as const;
export type CardBike = Pick<Bike, (typeof CARD_FIELDS)[number]>;
export const toCard = (b: Bike): CardBike => Object.fromEntries(CARD_FIELDS.map((k) => [k, b[k] ?? null])) as unknown as CardBike;
