'use client';

import { useMemo, useState } from 'react';

export type CalcBike = {
  slug: string;
  label: string;
  price: number | null;
  fuelType: 'petrol' | 'electric';
  mileage: number | null;
  rangeKm: number | null;
  batteryKwh: number | null;
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const num = (v: string, fallback = 0) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : fallback);

function Field({ label, value, onChange, suffix, hint, step = 'any' }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string; step?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <span className="relative block">
        <input type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-3 pr-14 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function BikeSelect({ bikes, value, onChange }: { bikes: CalcBike[]; value: string; onChange: (slug: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">Pick a bike (optional)</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-3">
        <option value="">Enter values manually</option>
        {bikes.map((b) => <option key={b.slug} value={b.slug}>{b.label}</option>)}
      </select>
    </label>
  );
}

function Result({ rows, big }: { rows: { label: string; value: string }[]; big: { label: string; value: string } }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5" aria-live="polite">
      <p className="text-sm text-muted-foreground">{big.label}</p>
      <p className="text-3xl font-black tracking-tight text-primary sm:text-4xl">{big.value}</p>
      <dl className="mt-4 divide-y divide-border text-sm">
        {rows.map((r) => <div key={r.label} className="flex justify-between gap-4 py-2"><dt className="text-muted-foreground">{r.label}</dt><dd className="font-semibold">{r.value}</dd></div>)}
      </dl>
    </div>
  );
}

const shell = 'grid gap-6 lg:grid-cols-2';
const panel = 'space-y-4 rounded-2xl border border-border bg-card p-5';

export function EmiCalculator({ bikes, initialSlug = '' }: { bikes: CalcBike[]; initialSlug?: string }) {
  const start = bikes.find((b) => b.slug === initialSlug);
  const [slug, setSlug] = useState(start?.slug ?? '');
  const [price, setPrice] = useState(String(start?.price ?? 100000));
  const [down, setDown] = useState('20');
  const [rate, setRate] = useState('11');
  const [years, setYears] = useState('3');

  const pick = (s: string) => {
    setSlug(s);
    const b = bikes.find((x) => x.slug === s);
    if (b?.price) setPrice(String(b.price));
  };

  const r = useMemo(() => {
    const P = num(price);
    const dp = Math.min(Math.max(num(down), 0), 100);
    const loan = P * (1 - dp / 100);
    const n = Math.max(1, Math.round(num(years, 1) * 12));
    const i = num(rate) / 12 / 100;
    const emi = i === 0 ? loan / n : (loan * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = emi * n;
    return { loan, emi: loan > 0 ? emi : 0, total, interest: Math.max(0, total - loan), downAmt: P - loan, n };
  }, [price, down, rate, years]);

  return (
    <div className={shell}>
      <div className={panel}>
        <BikeSelect bikes={bikes.filter((b) => b.price)} value={slug} onChange={pick} />
        <Field label="Price of the bike" value={price} onChange={setPrice} suffix="₹" hint="Use the on-road price from your dealer for the most realistic EMI." />
        <Field label="Down payment" value={down} onChange={setDown} suffix="%" />
        <Field label="Interest rate (per year)" value={rate} onChange={setRate} suffix="%" step="0.1" hint="Ask your lender for the actual rate; two-wheeler loan rates vary widely." />
        <Field label="Loan tenure" value={years} onChange={setYears} suffix="years" step="0.5" />
      </div>
      <Result
        big={{ label: 'Monthly EMI', value: inr(r.emi) }}
        rows={[
          { label: 'Down payment', value: inr(r.downAmt) },
          { label: 'Loan amount', value: inr(r.loan) },
          { label: `Total interest (${r.n} months)`, value: inr(r.interest) },
          { label: 'Total payable on loan', value: inr(r.total) },
        ]}
      />
    </div>
  );
}

export function RunningCostCalculator({ bikes, initialSlug = '' }: { bikes: CalcBike[]; initialSlug?: string }) {
  const start = bikes.find((b) => b.slug === initialSlug);
  const [slug, setSlug] = useState(start?.slug ?? '');
  const [electric, setElectric] = useState(start?.fuelType === 'electric');
  const [km, setKm] = useState('800');
  const [fuelPrice, setFuelPrice] = useState('100');
  const [mileage, setMileage] = useState(String(start?.mileage ?? 45));
  const [tariff, setTariff] = useState('8');
  const [kwhPerKm, setKwhPerKm] = useState(String(start?.batteryKwh && start?.rangeKm ? (start.batteryKwh / start.rangeKm).toFixed(3) : 0.025));
  const [pctPetrol, setPctPetrol] = useState('85');
  const [pctEv, setPctEv] = useState('80');

  const pick = (s: string) => {
    setSlug(s);
    const b = bikes.find((x) => x.slug === s);
    if (!b) return;
    const isEv = b.fuelType === 'electric';
    setElectric(isEv);
    if (b.mileage) setMileage(String(b.mileage));
    if (b.batteryKwh && b.rangeKm) setKwhPerKm((b.batteryKwh / b.rangeKm).toFixed(3));
  };

  const r = useMemo(() => {
    const d = num(km);
    if (electric) {
      const realKwhPerKm = num(kwhPerKm) / (Math.max(10, num(pctEv)) / 100);
      const perKm = realKwhPerKm * num(tariff);
      const month = d * perKm;
      return { perKm, month, year: month * 12 };
    }
    const realMileage = num(mileage) * (Math.max(10, num(pctPetrol)) / 100);
    const perKm = realMileage > 0 ? num(fuelPrice) / realMileage : 0;
    const month = d * perKm;
    return { perKm, month, year: month * 12 };
  }, [electric, km, fuelPrice, mileage, tariff, kwhPerKm, pctPetrol, pctEv]);

  return (
    <div className={shell}>
      <div className={panel}>
        <BikeSelect bikes={bikes} value={slug} onChange={pick} />
        <div role="tablist" aria-label="Vehicle type" className="grid grid-cols-2 rounded-xl bg-muted p-1">
          {[['Petrol', false], ['Electric', true]].map(([l, v]) => (
            <button key={String(l)} type="button" role="tab" aria-selected={electric === v} onClick={() => setElectric(v as boolean)} className={`min-h-11 rounded-lg text-sm font-bold ${electric === v ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>{l as string}</button>
          ))}
        </div>
        <Field label="Distance per month" value={km} onChange={setKm} suffix="km" />
        {electric ? (
          <>
            <Field label="Electricity price" value={tariff} onChange={setTariff} suffix="₹/kWh" hint="Check your home electricity bill for your rate." />
            <Field label="Energy use (claimed)" value={kwhPerKm} onChange={setKwhPerKm} suffix="kWh/km" step="0.001" hint="Battery size divided by claimed range, filled in when you pick a bike." />
            <Field label="Real-world efficiency vs claimed" value={pctEv} onChange={setPctEv} suffix="%" hint="Editable assumption: real riding usually gives less than the claimed range." />
          </>
        ) : (
          <>
            <Field label="Petrol price" value={fuelPrice} onChange={setFuelPrice} suffix="₹/L" hint="Enter today's price in your city." />
            <Field label="Mileage (claimed)" value={mileage} onChange={setMileage} suffix="km/l" />
            <Field label="Real-world mileage vs claimed" value={pctPetrol} onChange={setPctPetrol} suffix="%" hint="Editable assumption: most riders see 10–20% less than the claimed figure." />
          </>
        )}
      </div>
      <Result
        big={{ label: 'Estimated cost per month', value: inr(r.month) }}
        rows={[
          { label: 'Cost per km', value: `₹${r.perKm.toFixed(2)}` },
          { label: 'Cost per year', value: inr(r.year) },
        ]}
      />
    </div>
  );
}

export const FuelCostCalculator = RunningCostCalculator;

const STATE_RTO_RATES = [
  { name: 'Manual / custom rate', rate: null },
  { name: 'Delhi (~8%)', rate: 8 },
  { name: 'Maharashtra (~10%)', rate: 10 },
  { name: 'Karnataka (~12%)', rate: 12 },
  { name: 'Tamil Nadu (~8%)', rate: 8 },
  { name: 'Uttar Pradesh (~8%)', rate: 8 },
  { name: 'Gujarat (~6%)', rate: 6 },
  { name: 'Kerala (~10%)', rate: 10 },
  { name: 'Rajasthan (~9%)', rate: 9 },
  { name: 'Telangana (~9%)', rate: 9 },
  { name: 'West Bengal (~8%)', rate: 8 },
  { name: 'Haryana (~8%)', rate: 8 },
  { name: 'Punjab (~9%)', rate: 9 },
];

export function OnRoadCalculator({ bikes, initialSlug = '' }: { bikes: CalcBike[]; initialSlug?: string }) {
  const start = bikes.find((b) => b.slug === initialSlug);
  const [slug, setSlug] = useState(start?.slug ?? '');
  const [ex, setEx] = useState(String(start?.price ?? 100000));
  const [stateName, setStateName] = useState('');
  const [tax, setTax] = useState('8');
  const [ins, setIns] = useState('5');
  const [other, setOther] = useState('3000');

  const selectedBike = bikes.find((x) => x.slug === slug);
  const isEv = selectedBike?.fuelType === 'electric';

  const pick = (s: string) => {
    setSlug(s);
    const b = bikes.find((x) => x.slug === s);
    if (b?.price) setEx(String(b.price));
    if (b?.fuelType === 'electric') {
      setTax('0');
      setStateName('EV (0% Road Tax in most states)');
    }
  };

  const onStateChange = (st: string) => {
    setStateName(st);
    const match = STATE_RTO_RATES.find((x) => x.name === st);
    if (match && match.rate !== null) {
      setTax(String(match.rate));
    }
  };

  const r = useMemo(() => {
    const e = num(ex);
    const t = (e * num(tax)) / 100;
    const i = (e * num(ins)) / 100;
    return { e, t, i, o: num(other), total: e + t + i + num(other) };
  }, [ex, tax, ins, other]);

  return (
    <div className={shell}>
      <div className={panel}>
        <BikeSelect bikes={bikes.filter((b) => b.price)} value={slug} onChange={pick} />
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">State / RTO preset</span>
          <select value={stateName} onChange={(e) => onStateChange(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-3">
            {isEv && <option value="EV (0% Road Tax in most states)">EV (0% Road Tax in most states)</option>}
            {STATE_RTO_RATES.map((st) => <option key={st.name} value={st.name}>{st.name}</option>)}
          </select>
        </label>
        <Field label="Ex-showroom price" value={ex} onChange={setEx} suffix="₹" />
        <Field label="Registration and road tax" value={tax} onChange={setTax} suffix="%" step="0.1" hint={isEv ? 'Many Indian states waive 100% of road tax for electric two-wheelers.' : 'Varies by state and bike. Pick a state above or edit directly.'} />
        <Field label="Insurance (first year)" value={ins} onChange={setIns} suffix="%" step="0.1" hint="Rough share of ex-showroom price; your quote will differ." />
        <Field label="Other charges" value={other} onChange={setOther} suffix="₹" hint="Handling, plates, accessories. Ask the dealer for an itemised list." />
      </div>
      <Result
        big={{ label: 'Estimated on-road price', value: inr(r.total) }}
        rows={[
          { label: 'Ex-showroom', value: inr(r.e) },
          { label: 'Registration and road tax', value: inr(r.t) },
          { label: 'Insurance', value: inr(r.i) },
          { label: 'Other charges', value: inr(r.o) },
        ]}
      />
    </div>
  );
}
