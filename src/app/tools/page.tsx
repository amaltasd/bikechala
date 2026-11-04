import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Fuel, Receipt } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bike Tools & Calculators',
  description: 'EMI, running cost and on-road price calculators for bikes and scooters in India.',
  alternates: { canonical: '/tools' },
};

const TOOLS = [
  { href: '/tools/emi-calculator', icon: Calculator, title: 'EMI calculator', text: 'Monthly payment, total interest and down payment for a bike loan.' },
  { href: '/tools/fuel-cost-calculator', icon: Fuel, title: 'Running cost calculator', text: 'What a month of riding costs, petrol or electric.' },
  { href: '/tools/on-road-price-calculator', icon: Receipt, title: 'On-road price calculator', text: 'Estimate on-road price from ex-showroom using editable tax and insurance rates.' },
];

export default function ToolsPage() {
  return (
    <div className="flex-1 bg-muted/30 pb-8">
      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-10">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Tools &amp; calculators</h1>
        <div className="grid gap-3">
          {TOOLS.map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 active:scale-[0.99] hover:border-primary">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
              <span><span className="block text-lg font-bold">{title}</span><span className="text-sm text-muted-foreground">{text}</span></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
