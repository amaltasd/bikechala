import Link from 'next/link';
import { getBrands } from '@/lib/bikes';

export default function Footer() {
  const brands = getBrands().slice(0, 8);
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="container mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-black tracking-tighter">BIKE<span className="text-primary">CHALA</span></p>
          <p className="mt-2 text-sm text-muted-foreground">Bikes and scooters in India: specs, prices, comparisons and calculators.</p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Brands</p>
          <ul className="space-y-1">{brands.map((b) => <li key={b.slug}><Link href={`/bikes/${b.slug}`} className="inline-block py-1 text-sm hover:text-primary">{b.name}</Link></li>)}</ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Explore</p>
          <ul className="space-y-1 text-sm">
            {[['/bikes', 'All bikes'], ['/best/best-mileage-bikes', 'Best mileage'], ['/best/best-electric-scooters', 'Electric scooters'], ['/compare', 'Compare bikes'], ['/news', 'Articles']].map(([h, l]) => <li key={h}><Link href={h} className="inline-block py-1 hover:text-primary">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Tools</p>
          <ul className="space-y-1 text-sm">
            {[['/tools/emi-calculator', 'EMI calculator'], ['/tools/fuel-cost-calculator', 'Running cost'], ['/tools/on-road-price-calculator', 'On-road price']].map(([h, l]) => <li key={h}><Link href={h} className="inline-block py-1 hover:text-primary">{l}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground">
          Prices are ex-showroom (Delhi unless noted) and change often. Specs and mileage are manufacturer claims. Always confirm with your dealer before buying.
        </p>
      </div>
    </footer>
  );
}
