export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Guide';
  author: string;
  timestamp: number;
  content: string;
};

const at = (iso: string) => new Date(`${iso}T09:00:00+05:30`).getTime();

/**
 * Evergreen explainers only. Time-sensitive news needs a real feed or an editor,
 * so none is invented here — add entries below (or load from a CMS) when you have them.
 */
export const articles: Article[] = [
  {
    slug: 'how-to-read-bike-specs',
    title: 'How to Read a Bike Spec Sheet: What Actually Matters',
    excerpt: 'Engine size, PS, Nm, kerb weight, seat height, ABS — what each number means and which ones should change your decision.',
    category: 'Guide',
    author: 'BikeChala Team',
    timestamp: at('2026-11-04'),
    content: `A spec sheet is a wall of numbers. Most of them matter less than the brochure suggests, and a few matter a lot. Here is how to read one quickly.

## Engine size (cc)

Displacement tells you how big the engine is, not how fast the bike feels. A 150 cc sports bike and a 150 cc commuter can feel completely different because of tuning, gearing and weight. Use cc to group bikes (110, 125, 150, 200, 350 and up), then look at power and torque to compare within a group.

## Power (PS or bhp) and torque (Nm)

- **Power** decides how quickly the bike keeps accelerating and how relaxed it feels at highway speed.
- **Torque** decides how strongly it pulls from low speeds, which matters more in stop-and-go city riding.
- Indian brochures mix **PS** and **bhp**. They are close but not identical: 1 PS is about 0.986 bhp. Do not compare a PS figure directly with a bhp figure for tight calls.
- Check the **rpm** at which the peak figure arrives. A bike making its peak torque low in the rev range is easier to ride in traffic.

## Kerb weight and seat height

Kerb weight includes fuel and fluids. A lighter bike is easier to manoeuvre, park and ride in traffic. Seat height tells you whether you can plant your feet; sit on the bike if you can, because the shape of the seat matters as much as the number.

## Brakes and ABS

- **CBS** (combined braking) links front and rear brakes on smaller bikes.
- **Single-channel ABS** works on the front wheel only.
- **Dual-channel ABS** works on both wheels and is worth paying for on anything quick or heavy, especially if you ride in the rain.

## Fuel tank and mileage

Multiply tank size by claimed mileage for a rough range, then take 10–20% off for real riding. A bigger tank means fewer fuel stops on long trips, but also more weight.

## Quick checklist

1. Group by engine size and category, not by brand.
2. Compare power and torque inside that group.
3. Insist on ABS if the bike is quick, heavy or you ride in the rain.
4. Sit on it for seat height, reach and weight feel.
5. Check the price is ex-showroom, then work out the on-road price.

Use our [compare tool](/compare) to put two bikes side by side, with the better number in each row highlighted.`,
  },
  {
    slug: 'claimed-vs-real-world-mileage',
    title: 'Claimed vs Real-World Mileage: Why Your Bike Gives Less',
    excerpt: 'The brochure number comes from a lab test. Here is why real riding gives less, and how to get closer to it.',
    category: 'Guide',
    author: 'BikeChala Team',
    timestamp: at('2026-11-03'),
    content: `Every bike in India carries a certified mileage figure, usually called ARAI mileage. It is a useful way to compare bikes because every bike goes through the same procedure. It is not a prediction of what you will see in your own riding.

## Why the number is optimistic

The certification is done on a controlled test cycle: a fixed speed pattern, a light rider, no wind, no hills and no heavy traffic. Real roads add stop-and-go riding, rough surfaces, a heavier rider and luggage, headwinds and AC-less summer heat.

## What real-world usually looks like

Most owners see somewhat less than the claim, and the gap is bigger for powerful bikes ridden hard than for small commuters ridden gently. Treat the claimed figure as a way to **rank** bikes, and plan your running cost with a lower number. Our [running-cost calculator](/tools/fuel-cost-calculator) lets you enter your own real-world figure.

## How to get closer to the claim

- **Tyre pressure:** Low pressure is the most common and cheapest cause of poor mileage.
- **Smooth throttle:** Hard acceleration and late braking cost more fuel than steady riding.
- **Right gear:** Do not labour the engine in a high gear or rev it in a low one.
- **Service on time:** A dirty air filter, old spark plug or a dry chain all drag mileage down.
- **Chain care:** Clean and lubricate it regularly.
- **Weight and speed:** Luggage and sustained high speed both hurt.

## Comparing bikes fairly

When you compare two bikes on mileage, compare them within the same engine size and use the same source for both. A 5% difference on paper is well inside the range that riding style and road conditions will swamp.`,
  },
  {
    slug: 'electric-scooter-buying-guide',
    title: 'Electric Scooter Buying Guide: Range, Battery and Charging',
    excerpt: 'Claimed range, battery size, charging time and warranty — the questions to ask before you buy an electric two-wheeler.',
    category: 'Guide',
    author: 'BikeChala Team',
    timestamp: at('2026-11-02'),
    content: `Electric scooters are cheap to run and simple to ride, but their spec sheets use different terms from petrol bikes. This guide covers what to check.

## Range: claimed versus real

The range in the brochure is measured on a test cycle under ideal conditions. Real-world range is lower and depends on speed, rider weight, road gradient, temperature and riding mode. A sensible approach is to take your daily distance, add a comfortable buffer, and choose a scooter whose claimed range comfortably exceeds that. If you ride about 40 km a day and want to charge every two or three days, you need considerably more range than 40 km on paper.

## Battery capacity (kWh)

Capacity is the size of the fuel tank. A bigger battery gives more range but costs more and takes longer to charge. Compare **kWh** alongside range: two scooters with the same claimed range but different battery sizes are being driven very differently.

## Charging

- **Home charging** from a normal socket is the main way most owners charge. Ask how long a full charge takes and whether a portable charger is included.
- **Fast charging** may be an extra-cost accessory or only available on some variants, so check the variant you are buying.
- Look at the **0 to 80%** time rather than 0 to 100%; the last stretch is always slower.

## Warranty

Battery warranty is the single most important line on the page, because the battery is the most expensive part. Compare the **years and the kilometre limit**, and read what the warranty counts as failure, since many cover capacity loss only below a stated threshold.

## Battery-as-a-service pricing

Some brands list a lower price with the battery rented separately. The headline price looks attractive, but you pay a recurring fee, so work out the total cost over the years you will own the scooter.

## Questions to ask the dealer

1. What is the on-road price, and are any subsidies already included?
2. What does the battery warranty cover, in years and kilometres?
3. Is the charger included, and what is the real charging time?
4. Where is the nearest authorised service centre?

Browse our [electric scooter ranking](/best/best-electric-scooters) or compare two models side by side with the [compare tool](/compare).`,
  },
  {
    slug: 'how-on-road-price-is-calculated',
    title: 'Ex-Showroom vs On-Road Price: What You Really Pay for a Bike',
    excerpt: 'The price on the brochure is not the price you pay. Here is how ex-showroom becomes on-road, and what to ask your dealer.',
    category: 'Guide',
    author: 'BikeChala Team',
    timestamp: at('2026-11-01'),
    content: `The number you see on a manufacturer's website or a comparison page is the **ex-showroom price**. It is the starting point, not the bill.

## What gets added

- **Registration and road tax:** Charged by your state's transport authority. The rate depends on the state and often on the bike's price or engine size.
- **Insurance:** Third-party cover is mandatory. Comprehensive cover costs more and protects your own bike too.
- **Other charges:** Handling or documentation fees, high-security number plate (HSRP) charges in some states, and optional accessories or extended warranty the dealer may offer.

So: **on-road price = ex-showroom + registration and road tax + insurance + other charges.**

## Why prices differ between cities

Ex-showroom prices differ slightly by city because of local taxes, and road tax rates differ widely by state. The Delhi ex-showroom prices on this site are a reference point, not a quote for your city.

## What to ask for

1. A written, itemised on-road price, not a verbal total.
2. Which insurance cover is included, and whether you can choose your own insurer.
3. Which accessories are bundled, and whether they are optional.
4. Whether any offers, exchange bonus or festival discount apply.

## Financing

If you take a loan, the lender may charge a processing fee and the bike will be registered with them as hypothecation until the loan is paid off. Use the [EMI calculator](/tools/emi-calculator) to see monthly payments and total interest for different down payments and tenures.

Our [on-road price calculator](/tools/on-road-price-calculator) gives a rough estimate using rates you can edit to match your state and dealer quote.`,
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export function readingTimeMinutes(content = '') {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatPublishedDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(timestamp));
}

function headingSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
}

/** "## Heading" lines of a markdown body → table-of-contents entries with stable ids. */
export function extractHeadings(markdown = '') {
  const seen = new Map<string, number>();
  return markdown
    .split('\n')
    .map((line) => line.match(/^##\s+(.+?)\s*#*\s*$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => {
      const text = m[1].replace(/[*_`[\]]/g, '').trim();
      const base = headingSlug(text) || 'section';
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { text, id: n ? `${base}-${n}` : base };
    });
}
