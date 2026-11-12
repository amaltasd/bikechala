import Link from 'next/link';
import { Bike, ShieldCheck, Calculator, Sparkles } from 'lucide-react';
import { getBrands } from '@/lib/bikes';

export default function Footer() {
  const brands = getBrands().slice(0, 10);

  return (
    <footer className="mt-auto border-t border-border bg-slate-950 text-slate-200">
      <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Bike className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-black tracking-tight text-white">
                BIKE<span className="text-primary">CHALA</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              India&apos;s authoritative two-wheeler research and decision portal. Compare verified ex-showroom prices, estimated on-road prices, claimed vs real-world mileage, and detailed technical specifications across 230+ bikes and electric scooters.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Ad-Free & Fact-Checked Data</span>
            </div>
          </div>

          {/* Col 2: Top Brands */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Top Two-Wheeler Brands
            </p>
            <ul className="space-y-2 text-xs">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/bikes/${b.slug}`} className="text-slate-400 transition-colors hover:text-white">
                    {b.name} Bikes in India
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Categories & Buying Guides */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Popular Categories
            </p>
            <ul className="space-y-2 text-xs">
              {[
                ['/bikes', 'All Bikes in India'],
                ['/best/best-mileage-bikes', 'Best Mileage Commuters'],
                ['/best/best-electric-scooters', 'Electric Scooters (EVs)'],
                ['/best/best-bikes-under-1-lakh', 'Best Bikes Under ₹1 Lakh'],
                ['/best/best-bikes-under-2-lakh', 'Best Bikes Under ₹2 Lakh'],
                ['/bikes?category=scooter', 'Scooters in India'],
                ['/bikes?category=cruiser', 'Cruiser Motorcycles'],
                ['/bikes?category=adventure', 'Adventure Tourer Bikes'],
                ['/bikes?category=sports', 'Supersport & Track Bikes'],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="text-slate-400 transition-colors hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Tools & Calculators */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Tools & Calculators
            </p>
            <ul className="space-y-2 text-xs">
              {[
                ['/tools/emi-calculator', 'Two-Wheeler Loan EMI Calculator'],
                ['/tools/on-road-price-calculator', 'City-Wise On-Road Price Calculator'],
                ['/tools/fuel-cost-calculator', 'Daily Fuel & Running Cost Calculator'],
                ['/compare', 'Head-to-Head Bike Comparison'],
                ['/tools', 'All Buyer Tools & Utilities'],
                ['/news', 'Motorcycle News & Buying Guides'],
                ['/about', 'How We Source & Verify Data'],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="text-slate-400 transition-colors hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Popular Comparisons */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Trending Comparisons
            </p>
            <ul className="space-y-2 text-xs">
              {[
                ['/compare/royal-enfield-hunter-350-vs-royal-enfield-classic-350', 'Hunter 350 vs Classic 350'],
                ['/compare/yamaha-mt-15-v2-vs-yamaha-r15-v4', 'Yamaha MT-15 V2 vs R15 V4'],
                ['/compare/hero-splendor-plus-vs-honda-shine-100', 'Splendor Plus vs Shine 100'],
                ['/compare/tvs-apache-rtr-160-vs-bajaj-pulsar-n160', 'Apache RTR 160 vs Pulsar N160'],
                ['/compare/honda-activa-vs-tvs-jupiter', 'Honda Activa vs TVS Jupiter'],
                ['/compare/bajaj-dominar-400-vs-ktm-390-duke', 'Dominar 400 vs KTM Duke 390'],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="text-slate-400 transition-colors hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* City On-Road Price Cloud */}
        <div className="mt-10 border-t border-slate-800/80 pt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
            Check Two-Wheeler On-Road Prices by State & City
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore'].map((c) => (
              <Link
                key={c}
                href={`/tools/on-road-price-calculator?state=${encodeURIComponent(c)}`}
                className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
              >
                On-Road Price in {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <p className="text-[11px] leading-relaxed text-slate-500">
            <strong>Statutory Notice & Pricing Disclaimer:</strong> All ex-showroom prices listed on BikeChala are indicative base prices (Delhi unless specified otherwise) based on manufacturer catalogs and official disclosures. On-road prices include state RTO road tax (varying from 4% in Delhi to 18% in Karnataka), mandatory 5-year third-party + 1-year own-damage insurance, municipal cess, and local dealer handling charges. ARAI-certified mileage figures and EV ranges are manufacturer claims tested under laboratory conditions; real-world figures vary depending on road conditions, payload, and riding style. Always verify the final on-road quotation with an authorized dealer in your city before making a booking deposit.
          </p>
          <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-slate-900 pt-4 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} BikeChala. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-slate-300">About Us</Link>
              <Link href="/about" className="hover:text-slate-300">Editorial Policy</Link>
              <Link href="/sitemap.xml" className="hover:text-slate-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
