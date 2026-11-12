'use client';

import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { type CardBike, CATEGORY_LABEL, bikeUrl, keyStats, priceLabel, formatPrice, bikeImage, brandLogo } from '@/lib/bike-core';
import CompareToggle from '@/components/CompareToggle';
import { useCity, estimateOnRoadPrice, estimateEmi } from '@/components/CityStore';

/** Visual tile for bike photos with brand logo fallback and bottom-right branding watermark */
export function BikeMark({ bike, className = '' }: { bike: CardBike; className?: string }) {
  const ev = bike.fuelType === 'electric';
  const img = bikeImage(bike);
  if (img) {
    return (
      <div aria-hidden className={`relative overflow-hidden bg-gradient-to-b from-slate-50 to-muted/40 dark:from-slate-900/30 dark:to-slate-900/10 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={`${bike.brand} ${bike.name} ${CATEGORY_LABEL[bike.category]} in India${bike.exShowroomPriceInr ? ` - ${formatPrice(bike.exShowroomPriceInr)}` : ''}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {/* Minimal branding watermark overlay */}
        <span className="pointer-events-none absolute bottom-2 right-2 flex select-none items-center gap-1 rounded-full bg-slate-950/70 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          bikechala.com
        </span>
      </div>
    );
  }
  if (brandLogo(bike.brandSlug)) {
    return (
      <div aria-hidden className={`flex items-center justify-center bg-muted/40 ${className}`}>
        <BrandLogo brand={bike.brand} brandSlug={bike.brandSlug} className="h-12 w-12 max-h-16 max-w-16 object-contain opacity-80" />
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
  const { city } = useCity();
  const stats = keyStats(bike);
  const known = formatPrice(bike.exShowroomPriceInr);
  const onRoadEst = estimateOnRoadPrice(bike.exShowroomPriceInr, bike.fuelType, city);
  const emiEst = estimateEmi(bike.exShowroomPriceInr);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl overflow-hidden">
      {/* 16:9 Aspect Ratio Image Container */}
      <div className="relative">
        <BikeMark bike={bike} className="h-44 w-full sm:h-48 text-3xl sm:text-4xl" />
        
        {/* Compare pill on top right */}
        <CompareToggle slug={bike.slug} label={`${bike.brand} ${bike.name}`} />

        {/* EV / Eco Tag on top left if applicable */}
        {bike.fuelType === 'electric' && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            <Zap className="h-3 w-3" /> Electric
          </span>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Badge */}
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
          {CATEGORY_LABEL[bike.category]}
        </p>

        {/* Model Name */}
        <h3 className="mt-1 line-clamp-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">
          <Link href={bikeUrl(bike)}>
            {bike.brand} {bike.name}
          </Link>
        </h3>

        {/* Key Specs Pills */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {stats.map((s, idx) => (
            <span key={s.label} className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 font-medium">
              {s.value}
            </span>
          ))}
        </div>

        {/* Price & EMI Section */}
        <div className="mt-auto pt-3 border-t border-border/70">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-lg font-black tracking-tight text-foreground">
                {known ? (
                  <>
                    {priceLabel(bike)}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">ex-showroom</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">
                    {bike.listingStatus === 'prebook' ? 'Pre-booking' : 'Price not confirmed'}
                  </span>
                )}
              </p>
              {onRoadEst && (
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  On-Road {city}: ~{formatPrice(onRoadEst)}
                </p>
              )}
            </div>

            {emiEst && (
              <span className="text-[11px] font-semibold text-muted-foreground text-right">
                EMI @ ₹{emiEst.toLocaleString('en-IN')}/mo
              </span>
            )}
          </div>

          {/* High-Intent Primary CTA Button (BikeWale / BikeDekho Standard) */}
          <Link
            href={bikeUrl(bike)}
            className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-98"
          >
            <span>Check On-Road Price in {city}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
