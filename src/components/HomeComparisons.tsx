import Link from 'next/link';
import { ArrowRight, GitCompare } from 'lucide-react';
import { bikes, formatPrice, bikeImage, type Bike } from '@/lib/bikes';

interface PairDef {
  slugA: string;
  slugB: string;
  title: string;
}

const COMPARISON_PAIRS: PairDef[] = [
  {
    slugA: 'royal-enfield-classic-350',
    slugB: 'royal-enfield-hunter-350',
    title: 'Classic 350 vs Hunter 350',
  },
  {
    slugA: 'tvs-apache-rtr-160-4v',
    slugB: 'bajaj-pulsar-n160',
    title: 'Apache RTR 160 4V vs Pulsar N160',
  },
  {
    slugA: 'honda-shine',
    slugB: 'bajaj-pulsar-125',
    title: 'Honda Shine vs Pulsar 125',
  },
  {
    slugA: 'ather-450x',
    slugB: 'ola-electric-s1-pro',
    title: 'Ather 450X vs Ola S1 Pro',
  },
  {
    slugA: 'honda-activa',
    slugB: 'tvs-jupiter',
    title: 'Honda Activa vs TVS Jupiter',
  },
  {
    slugA: 'yamaha-mt-15-v2',
    slugB: 'ktm-200-duke',
    title: 'Yamaha MT-15 V2 vs KTM 200 Duke',
  },
];

export default function HomeComparisons() {
  const comparisons = COMPARISON_PAIRS.map((pair) => {
    const bikeA = bikes.find((b) => b.slug === pair.slugA);
    const bikeB = bikes.find((b) => b.slug === pair.slugB);
    if (!bikeA || !bikeB) return null;
    const pairSlug = bikeA.slug < bikeB.slug ? `${bikeA.slug}-vs-${bikeB.slug}` : `${bikeB.slug}-vs-${bikeA.slug}`;
    return { ...pair, bikeA, bikeB, href: `/compare/${pairSlug}` };
  }).filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <GitCompare className="h-4 w-4" />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Trending Two-Wheeler Comparisons
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Head-to-head tech specs, real-world mileage, and on-road price differences.
          </p>
        </div>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
        >
          <span>All comparisons</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map(({ href, title, bikeA, bikeB }) => {
          const imgA = bikeImage(bikeA);
          const imgB = bikeImage(bikeB);

          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-primary group-hover:underline">
                {title}
              </p>

              {/* Two Bikes Face-Off */}
              <div className="mt-3 grid grid-cols-2 items-center gap-2">
                {/* Bike A */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-muted/30 p-1">
                    {imgA ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgA.src}
                        alt={bikeA.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                        {bikeA.brand}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground line-clamp-1">{bikeA.name}</p>
                  <p className="text-[11px] font-semibold text-primary">{formatPrice(bikeA.exShowroomPriceInr)}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {bikeA.fuelType === 'electric' ? `${bikeA.rangeKm ?? '-'} km` : `${bikeA.mileageKmpl ?? '-'} km/l`}
                  </span>
                </div>

                {/* VS Badge */}
                <div className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-[10px] font-black text-muted-foreground shadow-xs">
                    VS
                  </span>
                </div>

                {/* Bike B */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-muted/30 p-1">
                    {imgB ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgB.src}
                        alt={bikeB.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                        {bikeB.brand}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground line-clamp-1">{bikeB.name}</p>
                  <p className="text-[11px] font-semibold text-primary">{formatPrice(bikeB.exShowroomPriceInr)}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {bikeB.fuelType === 'electric' ? `${bikeB.rangeKm ?? '-'} km` : `${bikeB.mileageKmpl ?? '-'} km/l`}
                  </span>
                </div>
              </div>

              {/* Bottom CTA bar */}
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold text-primary">
                <span>Compare Full Specs & Winner</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
