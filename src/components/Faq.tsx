import { ChevronDown } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { faqLd } from '@/lib/seo';

/** Plain <details> so every answer is in the HTML (readable by crawlers and AI assistants) and works without JS. */
export default function Faq({ faqs, title = 'Frequently asked questions' }: { faqs: { q: string; a: string }[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="rounded-2xl border border-border bg-card">
      <JsonLd data={faqLd(faqs)} />
      <h2 className="px-5 pt-5 text-lg font-bold">{title}</h2>
      <div className="mt-2 divide-y divide-border">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4 leading-relaxed text-foreground/85">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
