import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { EmiCalculator } from '@/components/Calculators';
import { bikes, bikeTitle } from '@/lib/bikes';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Bike Loan EMI Calculator (${CURRENT_YEAR}): Interest & Down Payment`,
  description: 'Calculate your two-wheeler loan EMI instantly online. Customize loan amount, interest rate (8%-18%) and tenure (1-5 years). See complete interest breakup, amortization table & compare bank loan options.',
  alternates: { canonical: '/tools/emi-calculator' },
  openGraph: {
    title: `Bike Loan EMI Calculator (${CURRENT_YEAR}) | BikeChala`,
    description: 'Calculate monthly two-wheeler loan EMIs, interest rates, and down payments instantly.',
    url: absoluteUrl('/tools/emi-calculator'),
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
    name: 'BikeChala Bike Loan EMI Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    url: absoluteUrl('/tools/emi-calculator'),
    description: 'Calculate two-wheeler loan EMI, interest rates and down payments for motorcycles and scooters in India.',
  };

  const faqs = [
    {
      q: 'How is two-wheeler loan EMI calculated?',
      a: 'Bike loan EMI is calculated using the reducing balance formula: E = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal loan amount, r is monthly interest rate, and n is loan tenure in months.',
    },
    {
      q: 'What is the typical interest rate for bike loans in India?',
      a: 'Two-wheeler loan interest rates in India typically range from 8.5% to 14.5% per annum for leading banks like SBI, HDFC Bank, ICICI Bank, and NBFCs like Hero FinCorp, TVS Credit, and Bajaj Finance depending on your credit score.',
    },
    {
      q: 'How much down payment is required for buying a bike?',
      a: 'Most Indian lenders finance between 80% to 95% of the on-road price, requiring a 10% to 20% down payment. Some zero-down-payment schemes exist during festive seasons for high-credit borrowers.',
    },
    {
      q: 'Can I prepay or foreclose my bike loan early?',
      a: 'Yes, most banks allow prepayment or foreclosure after 6 months of EMI payments. Fixed-rate loans may carry a 2% to 4% foreclosure charge, while floating rate loans have no penalty under RBI guidelines.',
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
            Bike Loan EMI Calculator ({CURRENT_YEAR})
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Calculate your monthly EMI, total interest payable, and required down payment for any motorcycle or electric scooter in India.
          </p>
        </div>

        {/* Interactive Calculator Component */}
        <EmiCalculator bikes={options} initialSlug={initial} />

        {/* Educational Content & Bank Interest Rates Table */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-7">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Two-Wheeler Loan Interest Rates by Top Indian Banks (2026)
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Current indicative interest rates and processing fees from leading lenders across India.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Bank / NBFC</th>
                  <th className="px-4 py-3">Interest Rate (p.a.)</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">Processing Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">State Bank of India (SBI)</td>
                  <td className="px-4 py-3 font-semibold text-primary">8.65% – 12.50%</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 5 Years</td>
                  <td className="px-4 py-3 text-muted-foreground">1.5% – 2.0%</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">HDFC Bank</td>
                  <td className="px-4 py-3 font-semibold text-primary">9.50% – 14.00%</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 4 Years</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 2.5%</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">ICICI Bank</td>
                  <td className="px-4 py-3 font-semibold text-primary">9.25% – 13.50%</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 4 Years</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 2.5%</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">Hero FinCorp</td>
                  <td className="px-4 py-3 font-semibold text-primary">10.50% – 15.00%</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 3 Years</td>
                  <td className="px-4 py-3 text-muted-foreground">Standard ₹1,000–₹2,000</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold text-foreground">TVS Credit</td>
                  <td className="px-4 py-3 font-semibold text-primary">10.00% – 14.50%</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 3 Years</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 2.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions on Bike Financing &amp; EMIs
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
