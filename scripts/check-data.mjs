// Sanity checks for src/data/bikes.json. Run: npm run check-data
import { readFileSync } from 'node:fs';

const bikes = JSON.parse(readFileSync(new URL('../src/data/bikes.json', import.meta.url), 'utf8'));
const errors = [];
const warnings = [];
const seen = new Set();
const CATS = ['commuter', 'sports', 'naked', 'cruiser', 'adventure', 'scooter', 'off-road'];

for (const b of bikes) {
  const id = b.slug || `${b.brand} ${b.name}`;
  for (const k of ['slug', 'brand', 'brandSlug', 'name', 'modelSlug', 'category', 'fuelType']) if (!b[k]) errors.push(`${id}: missing ${k}`);
  if (seen.has(b.slug)) errors.push(`${id}: duplicate slug`);
  seen.add(b.slug);
  if (b.slug !== `${b.brandSlug}-${b.modelSlug}`) errors.push(`${id}: slug is not brandSlug-modelSlug`);
  if (!CATS.includes(b.category)) errors.push(`${id}: bad category ${b.category}`);
  if (!['petrol', 'electric', 'cng'].includes(b.fuelType)) errors.push(`${id}: bad fuelType`);
  if (!Array.isArray(b.sources) || b.sources.length === 0) (b.officialUrl || b.specsPending ? warnings : errors).push(`${id}: no source URL in the price sheet`);
  if (!b.summary && !b.specsPending) warnings.push(`${id}: empty summary`);
  if (b.listingStatus && !['listed', 'unverified', 'prebook'].includes(b.listingStatus)) errors.push(`${id}: bad listingStatus`);
  if (b.imageUrl && !/^https?:\/\//.test(b.imageUrl)) errors.push(`${id}: bad imageUrl`);
  for (const v of b.variants ?? []) if (!v.name) errors.push(`${id}: variant without name`);
  const p = b.exShowroomPriceInr;
  if (p != null && (p < 30000 || p > 3000000)) warnings.push(`${id}: price ${p} looks unusual`);
  if (p == null && b.listingStatus !== 'prebook') warnings.push(`${id}: no confirmed price`);
  if (b.fuelType === 'petrol' && b.mileageKmpl != null && (b.mileageKmpl < 10 || b.mileageKmpl > 100)) warnings.push(`${id}: mileage ${b.mileageKmpl} looks unusual`);
  if (b.fuelType === 'petrol' && b.powerPs != null && b.engineCc && b.powerPs / b.engineCc > 0.25) warnings.push(`${id}: power/cc ratio looks high`);
  if (b.fuelType === 'electric' && b.rangeKm != null && (b.rangeKm < 40 || b.rangeKm > 400)) warnings.push(`${id}: range ${b.rangeKm} looks unusual`);
}

console.log(`${bikes.length} bikes, ${errors.length} errors, ${warnings.length} warnings`);
for (const w of warnings) console.log('  warn:', w);
for (const e of errors) console.log('  ERROR:', e);
process.exit(errors.length ? 1 : 0);
