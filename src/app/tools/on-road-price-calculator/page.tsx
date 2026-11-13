import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { OnRoadCalculator } from '@/components/Calculators';
import { bikes, bikeTitle } from '@/lib/bikes';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Two Wheeler On-Road Price Calculator (${CURRENT_YEAR}): RTO & Insurance`,
  description: 'Calculate accurate on-road bike prices across Indian states. See exact breakdown of Ex-Showroom price, RTO road tax (4%-18%), 5-year insurance & registration fees in your city.',
  alternates: { canonical: '/tools/on-road-price-calculator' },
  openGraph: {
    title: `Two Wheeler On-Road Price Calculator (${CURRENT_YEAR}) | BikeChala`,
    description: 'Calculate on-road motorcycle & scooter prices across Delhi, Maharashtra, Karnataka, Tamil Nadu and all Indian states.',
    url: absoluteUrl('/tools/on-road-price-calculator'),
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const initial = typeof sp.bike === 'string' ? sp.bike : '';
  const options = bikes.map((b) => ({
    slug: b.slug,
    label: bikeTitle(b),
    price: b.exShowroomPriceInr,
    fuelType: (b.fuelType === 'electric' ? 'electric' : 'petrol') as 'electric' | 'petrol',
    mileage: b.mileageKmpl ?? null,
    rangeKm: b.rangeKm ?? null,
    batteryKwh: b.batteryKwh ?? null,
  }));

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BikeChala On-Road Price Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    url: absoluteUrl('/tools/on-road-price-calculator'),
    description: 'Calculate on-road motorcycle prices including state RTO tax, 5-year insurance and registration across Indian states.',
  };

  const faqs = [
    {
      q: "How is a bike's on-road price calculated in India?",
      a: 'On-road price is the total amount paid to bring the bike on the road. Formula: On-Road Price = Ex-Showroom Price + State RTO Road Tax + Mandatory 5-Year Comprehensive/Third-Party Insurance + Registration Charges & Number Plate (HSRP) + Optional Dealer Handling/Logistics.',
    },
    {
      q: 'Why does on-road bike price differ so much between states?',
      a: 'Motor vehicle road tax is levied by individual state governments. For example, Delhi levies 4% to 8% road tax, whereas Karnataka levies 12% to 18%, and Maharashtra charges 10% to 12%. This creates a price difference of ₹15,000 to ₹30,000 on the same motorcycle.',
    },
    {
      q: 'Is road tax charged on electric two-wheelers?',
      a: 'In many Indian states including Delhi, Maharashtra, Gujarat, and Tamil Nadu, electric two-wheelers enjoy 0% RTO road tax and registration fee exemptions to promote green mobility under state EV policies.',
    },
    {
      q: 'Is 5-year insurance mandatory for new two-wheelers in India?',
      a: 'Yes, per Supreme Court and IRDAI regulations, every new two-wheeler purchased in India must have a mandatory 5-year third-party liability insurance policy upfront, typically bundled with 1-year own damage cover.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="flex-1 bg-muted/20 pb-12">
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-4 sm:py-8">
        <Link href="/tools" className="inline-flex min-h-10 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> All Tools
        </Link>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
            Two Wheeler On-Road Price Calculator ({CURRENT_YEAR})
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Estimate accurate on-road prices for any motorcycle or scooter across Indian states, factoring in state RTO tax slabs, mandatory 5-year insurance, and registration charges.
          </p>
        </div>

        {/* Interactive Calculator Component */}
        <OnRoadCalculator bikes={options} initialSlug={initial} />

        {/* State-Wise RTO Road Tax Slabs Table */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-7">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            State-Wise Two-Wheeler RTO Road Tax Slabs in India (2026)
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Comparison of state motor vehicle taxes for petrol bikes and electric two-wheelers.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">State / UT</th>
                  <th className="px-4 py-3">Petrol Bike RTO Tax</th>
                  <th className="px-4 py-3">EV Two-Wheeler Tax</th>
                  <th className="px-4 py-3">Key Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Delhi</td>
                  <td className="px-4 py-3 font-semibold text-primary">4% – 8%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">0% (100% Waived)</td>
                  <td className="px-4 py-3 text-muted-foreground">Based on price bracket (&lt;₹1L / &gt;₹1L)</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Maharashtra</td>
                  <td className="px-4 py-3 font-semibold text-primary">10% – 12%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">0% (EV Policy)</td>
                  <td className="px-4 py-3 text-muted-foreground">Higher tax on company registrations</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Karnataka</td>
                  <td className="px-4 py-3 font-semibold text-primary">12% – 18%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">4% – 5%</td>
                  <td className="px-4 py-3 text-muted-foreground">Tiered by cost of two-wheeler</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Tamil Nadu</td>
                  <td className="px-4 py-3 font-semibold text-primary">8% – 12%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">0% (Waived)</td>
                  <td className="px-4 py-3 text-muted-foreground">Flat lifetime tax slab</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Uttar Pradesh</td>
                  <td className="px-4 py-3 font-semibold text-primary">7% – 9%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">0% (Subsidized)</td>
                  <td className="px-4 py-3 text-muted-foreground">Calculated on ex-showroom invoice</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions on Bike On-Road Pricing
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <h3 className="text-sm font-bold text-foreground">{f.q}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
