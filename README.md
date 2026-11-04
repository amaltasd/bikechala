# BikeChala

Phone-first, installable (PWA) site for bikes and scooters in India. Built with Next.js 16, React 19 and Tailwind 4. Sister project to CarChala.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run check-data     # validates src/data/bikes.json
npm run build && npm start
```

## What's in it

- `/bikes`, `/bikes/[brand]`, `/bikes/[brand]/[model]`: listing with filters and search, brand pages, spec pages
- `/compare` and `/compare/[a]-vs-[b]`: side-by-side with the better value highlighted
- `/best/[list]`: ranked lists generated from the data (mileage, range, price bands)
- `/tools/*`: EMI, running cost (petrol or electric), on-road price
- `/news`: evergreen buying guides (see `src/lib/articles.ts`)
- PWA: manifest, service worker (`public/sw.js`), offline page, bottom tab bar, install prompt

## Data: read this before launch

`src/data/bikes.json` has 71 models, compiled by research agents from BikeDekho, BikeWale, ZigWheels and some manufacturer pages. Raw outputs are in `data-raw/`.

- **Prices were not all confirmed.** Where sources disagreed or none was found, the price is `null` and the site shows "Price not confirmed". 16 models are in that state (`npm run check-data` lists them).
- Many prices are undated listings. Treat every price as a starting point and verify against manufacturer sites before relying on it commercially.
- Every record lists the URLs it came from (`sources`) and a `priceAsOf` note.
- Some specs are `null` where sources conflicted. The UI hides empty rows.

## Not done yet

- **No photos.** Cards use a letter-mark tile because there are no licensed images. Add an `image` field and swap it into `BikeCard`/`BikeMark`.
- **No news feed.** `/news` holds four evergreen guides only. Time-sensitive news needs a real source or an editor.
- Tax and insurance rates in the on-road calculator are editable assumptions, not state-specific rates.
- Set `NEXT_PUBLIC_SITE_URL` in production (defaults to https://bikechala.com).

## Data and images

- `src/data/bikes.json` is built by `scripts/import_prices.py` (price sheet in `data-raw/`) and `scripts/import_package.py` (spec package in `data-raw/package/`). `npm run check-data` validates it.
- Models with a price but no confirmed specs are marked `specsPending`. Their pages show a notice, are `noindex`, and are left out of the sitemap until specs are added.
- **Images:** the sandbox this was built in cannot reach manufacturer sites, so no photos are bundled yet. On a machine with normal internet run `npm run fetch-images`. It downloads each model's `imageUrl` (and the `og:image` of official model pages) into `public/images/bikes/` and records the source in `src/data/images.json`. Pages pick images up automatically; commit both the folder and the JSON. Check you are comfortable with each brand's image terms before publishing.
