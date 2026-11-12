import Link from 'next/link';
import { HelpCircle, ChevronRight } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export const HOME_FAQS = [
  {
    q: 'How is the on-road bike price calculated in India?',
    a: 'On-road bike price is the final amount paid to bring the two-wheeler on public roads. It is calculated as: Ex-Showroom Price + State RTO Road Tax (4% to 18% depending on your state) + Mandatory 5-Year IRDAI Two-Wheeler Insurance + Registration Fees & High Security Registration Plate (HSRP) + Optional Dealer Handling/Logistics Charges. Use our on-road calculator to see city-wise breakdowns.',
  },
  {
    q: 'Why does on-road two-wheeler price vary between Delhi, Mumbai, and Bengaluru?',
    a: 'Motor vehicle road tax is a state subject in India. Delhi levies 4% to 8% road tax on two-wheelers, Maharashtra charges 10% to 12%, and Karnataka levies 12% to 18% (the highest in the country). A motorcycle priced at ₹1.5 Lakh ex-showroom can cost ₹1.68 Lakh on-road in Delhi, but over ₹1.92 Lakh in Bengaluru.',
  },
  {
    q: 'Do electric scooters have to pay RTO road tax and registration charges?',
    a: 'In key states like Delhi, Maharashtra, Gujarat, and Tamil Nadu, electric two-wheelers are exempt from 100% of state RTO road tax and registration fees under state EV promotion policies, making their on-road cost almost identical to the ex-showroom price plus insurance.',
  },
  {
    q: 'What is the difference between ARAI claimed mileage and real-world mileage?',
    a: 'ARAI (Automotive Research Association of India) mileage is measured under ideal laboratory conditions at constant speeds without real-world traffic, pillion riders, or wind resistance. In real-world Indian city riding conditions, motorcycles and scooters typically deliver 10% to 20% lower mileage than the manufacturer claim.',
  },
  {
    q: 'Is 5-year insurance mandatory for all new two-wheelers in India?',
    a: 'Yes, per Supreme Court directives and Insurance Regulatory and Development Authority of India (IRDAI) guidelines, every new motorcycle or scooter purchased in India must be sold with a mandatory 5-year Third-Party liability insurance policy, usually bundled with 1-year Own Damage (OD) cover.',
  },
];

export default function HomeFaq() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <JsonLd data={faqSchema} />
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HelpCircle className="h-4 w-4" />
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Frequently Asked Questions About Buying Bikes in India (2026)
        </h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Authoritative answers to state RTO road tax, on-road price formulas, EV incentives, and insurance rules.
      </p>

      <div className="mt-6 divide-y divide-border/80">
        {HOME_FAQS.map((faq, i) => (
          <details key={i} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-foreground transition-colors group-hover:text-primary">
              <span className="text-sm sm:text-base">{faq.q}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90 group-open:text-primary" />
            </summary>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
