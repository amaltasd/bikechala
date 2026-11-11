# BikeChala

Phone-first, installable (PWA) site for bikes and scooters in India. Built with Next.js 16, React 19 and Tailwind 4. Sister project to CarChala.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run check-data     # validates src/data/bikes.json (0 errors, 0 warnings)
npm run build && npm start
```

## What's in it

- `/bikes`, `/bikes/[brand]`, `/bikes/[brand]/[model]`: listing with live filters and search, brand pages, full spec pages across 232 models
- `/compare` and `/compare/[a]-vs-[b]`: side-by-side with the better value highlighted
- `/best/[list]`: ranked lists generated from the data (mileage, range, price bands)
- `/tools/*`: EMI, running cost (petrol or electric), on-road price (with state RTO presets)
- `/news`: evergreen buying guides (see `src/lib/articles.ts`)
- PWA: manifest, service worker (`public/sw.js`), offline page, bottom tab bar, install prompt

## Data status

`src/data/bikes.json` contains 232 models across 24 brands:

- **100% Data Quality:** `npm run check-data` passes with 0 errors and 0 warnings.
- **Specifications & Summaries:** All 232 models have complete specifications, key highlights, and informative summaries.
- **Prices & Pre-book states:** Confirmed ex-showroom prices for all active market models; upcoming models marked as `prebook` with clear customer badges.
- **Brand logos:** All 24 brands have official logos bundled in `public/logos/` and mapped in `src/data/brand-logos.json`.
- **Bike images:** Direct OEM photos fetched into `public/images/bikes/` and mapped in `src/data/images.json`. For models without direct photos, `BikeCard` renders the brand's official logo tile on a neutral muted card instead of an unstyled letter mark.

## SEO and AI-search (GEO) setup

- Every page type sets its own canonical URL. Filtered `/bikes?...` views are `noindex`.
- Structured data (JSON-LD): Organization and WebSite (with site search) everywhere; Product with price, availability, specs and image on model pages; BreadcrumbList on all inner pages; ItemList on brand and best-of pages; FAQPage on model, brand and best-of pages.
- `robots.txt` explicitly allows search and AI crawlers. `/llms.txt` is a plain-text site map for AI assistants. `/about` explains sources and method.
- The sitemap uses the newest data date for `lastmod`.
- Dynamic OpenGraph share images generated per model (`opengraph-image.tsx`).
- Google Analytics 4: Ready out-of-the-box via `NEXT_PUBLIC_GA_ID`.

## Launch order for Google

1. Set `NEXT_PUBLIC_SITE_URL=https://bikechala.com` in your hosting provider (e.g. Vercel).
2. Optional: Add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` for Google Analytics.
3. Verify the domain in Google Search Console (DNS method) and deploy.
4. Submit `/sitemap.xml` in Search Console and Bing Webmaster Tools.
5. Comparison pages (`/compare/a-vs-b`) are `noindex` by default. About 3 to 4 weeks after launch, set `INDEX_COMPARE=true` and redeploy.
