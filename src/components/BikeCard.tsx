import Link from 'next/link';
import { Zap } from 'lucide-react';
import { type Bike, CATEGORY_LABEL, bikeUrl, keyStats, priceLabel, formatPrice } from '@/lib/bikes';

/** Letter-mark tile in place of photos (no licensed images yet). */
export function BikeMark({ bike, className = '' }: { bike: Bike; className?: string }) {
  const ev = bike.fuelType === 'electric';
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center font-display font-black text-white ${ev ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-orange-500 to-red-700'} ${className}`}
    >
      {ev && <Zap className="mr-1 h-5 w-5 opacity-80" />}
      {bike.brand.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function BikeCard({ bike }: { bike: Bike }) {
  const stats = keyStats(bike);
  const known = formatPrice(bike.exShowroomPriceInr);
  return (
    <article className="group relative flex gap-3 rounded-2xl border border-border bg-card p-3 transition-all active:scale-[0.99] sm:flex-col sm:gap-0 sm:p-0 sm:hover:-translate-y-0.5 sm:hover:shadow-lg sm:overflow-hidden">
      <BikeMark bike={bike} className="h-20 w-20 shrink-0 rounded-xl text-2xl sm:h-28 sm:w-full sm:rounded-none sm:text-4xl" />
      <div className="flex min-w-0 flex-1 flex-col sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {CATEGORY_LABEL[bike.category]}{bike.fuelType === 'electric' ? ' · Electric' : ''}
        </p>
        <h3 className="mt-0.5 line-clamp-2 font-bold leading-snug">
          <Link href={bikeUrl(bike)} className="before:absolute before:inset-0 group-hover:text-primary">
            {bike.brand} {bike.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {stats.map((s) => <span key={s.label}>{s.value}</span>)}
        </div>
        <p className={`mt-auto pt-2 text-sm font-bold ${known ? '' : 'text-muted-foreground font-medium'}`}>
          {known ? <>{priceLabel(bike)} <span className="text-xs font-normal text-muted-foreground">ex-showroom</span></> : 'Price not confirmed'}
        </p>
      </div>
    </article>
  );
}
