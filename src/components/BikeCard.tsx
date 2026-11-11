import Link from 'next/link';
import { Zap } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { type CardBike, CATEGORY_LABEL, bikeUrl, keyStats, priceLabel, formatPrice, bikeImage, brandLogo } from '@/lib/bike-core';
import CompareToggle from '@/components/CompareToggle';

/** Visual tile for bike photos with brand logo fallback. */
export function BikeMark({ bike, className = '' }: { bike: CardBike; className?: string }) {
  const ev = bike.fuelType === 'electric';
  const img = bikeImage(bike);
  if (img) {
    return (
      <div aria-hidden className={`overflow-hidden bg-muted/40 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-2" />
      </div>
    );
  }
  if (brandLogo(bike.brandSlug)) {
    return (
      <div aria-hidden className={`flex items-center justify-center bg-muted/40 ${className}`}>
        <BrandLogo brand={bike.brand} brandSlug={bike.brandSlug} className="h-10 w-10 max-h-14 max-w-14 object-contain opacity-80" />
      </div>
    );
  }
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

export default function BikeCard({ bike }: { bike: CardBike }) {
  const stats = keyStats(bike);
  const known = formatPrice(bike.exShowroomPriceInr);
  return (
    <article className="group relative flex gap-3 rounded-2xl border border-border bg-card p-3 transition-all active:scale-[0.99] sm:flex-col sm:gap-0 sm:p-0 sm:hover:-translate-y-0.5 sm:hover:shadow-lg sm:overflow-hidden">
      <BikeMark bike={bike} className="h-24 w-28 shrink-0 rounded-xl text-2xl sm:h-36 sm:w-full sm:rounded-none sm:text-4xl" />
      <div className="flex min-w-0 flex-1 flex-col pr-20 sm:p-4 sm:pr-4">
        <p className="text-xs font-semibold text-primary">
          {CATEGORY_LABEL[bike.category]}{bike.fuelType === 'electric' ? ' · Electric' : bike.fuelType === 'cng' ? ' · CNG' : ''}
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
          {bike.listingStatus === 'prebook' && !known ? 'Pre-booking' : known ? <>{priceLabel(bike)} <span className="text-xs font-normal text-muted-foreground">ex-showroom</span></> : 'Price not confirmed'}
        </p>
      </div>
      <CompareToggle slug={bike.slug} label={`${bike.brand} ${bike.name}`} />
    </article>
  );
}
