# BikeChala Complete Data Package
**Build date:** 04 November 2026 (Asia/Kolkata)

## Package coverage
| Dataset | Records |
|---|---:|
| Model/product records | 232 |
| OEM-identified variants | 44 |
| Model specification observations | 367 |
| Feature tags | 164 |
| Media source records | 254 |
| Price history/source rows | 257 |
| OEM source registry entries | 27 |
| SEO page draft records | 232 |

The catalogue contains 24 manufacturer brands (including models, pre-book listings and off-road products where identified). Newly added catalogue entries are status-labelled; a catalogue listing is not a guarantee that a model is on sale at every dealer.

## Main files
- `BikeChala_Master_Database.xlsx` — Excel workbook with master catalogue, Start Here dashboard, official media index, variants, variant research queue, OEM source registry, SEO page drafts, long-form specifications, feature tags, price points, QA coverage and data dictionary.
- `data/models_master.csv` and `data/models_master.json` — website-ready flat master catalogue.
- `data/bikechala.sqlite` — populated normalized relational database.
- `sql/schema.sql` — SQL DDL for the normalized database.
- `data/variants.csv` — variant-level records captured from OEM pages/announcements.
- `data/variant_research_queue.csv` — model-by-model follow-up checklist for missing trim data.
- `data/model_specs_long.csv` and `data/features_long.csv` — normalized specs and features.
- `data/price_points.csv` — original/reference and latest-listed price observations with dates and sources.
- `data/media_assets.csv` and `data/official_media_index.csv` — OEM image, brochure and product/gallery links.
- `data/oem_source_registry.csv` — manufacturer source register.
- `data/seo_pages.csv` — draft slugs, titles, meta descriptions, H1s and FAQ prompts.
- `data/qa_coverage.csv` — quality and coverage per model.
- `data/data_dictionary.csv` — field definitions.
- `scripts/download_official_assets.py` — downloader for direct OEM image and PDF URLs.
- `website_import/` — sample JavaScript data loader and integration notes.
- `LICENSE_AND_ASSET_REUSE.md` — media licensing cautions.

## Data quality and publishing cautions
1. **Prices:** Existing price data was preserved from the earlier workbook. A number of prices are sourced from third-party listing pages, not direct OEM price lists. Treat them as indicative ex-showroom starting prices, not live quotes. Recheck city, model year, selected variant, effective date, taxes and dealer offers before publishing.
2. **Specifications:** Missing spec values are intentionally blank, not inferred. Some figures apply to only one trim or battery option; use the `Spec verification status`, source URL and row notes. A model-family figure must not be presented as applying to every variant.
3. **Variants:** 44 variant records are included, but this is not a complete variant matrix for every model. `Variant Research Queue` shows outstanding work.
4. **Model status:** The catalogue includes products found in OEM navigation, pre-book listings and off-road models. Confirm current sale status and homologation/road eligibility for each market before listing as an on-sale road bike.
5. **Media:** 254 media link records are indexed. This includes product/gallery pages as well as direct images and brochures. Actual OEM image/PDF binaries are not bundled because manufacturer hosts did not complete bulk downloads in this environment. Run the downloader script from an internet-connected machine to attempt direct files; see `data/asset_download_log.csv` after the run.
6. **Licensing:** A URL on an OEM domain proves source location, not permission to rehost or commercially reuse the asset. Check terms or secure written permission before publishing.
7. **SEO:** SEO titles and descriptions are drafts/templates, not publish-ready editorial copy. Write unique model-specific text and verify specs/prices to avoid duplicate or inaccurate pages.

## Quick start
1. Open the Excel workbook and start with **Start Here** and **QA Coverage**.
2. For website import, use `Model ID` as the stable key and `SEO slug` as the product page slug.
3. Prefer SQLite or normalized CSV files for production data; keep variants, prices and media linked using `Model ID`.
4. Run `python scripts/download_official_assets.py` from this folder to attempt direct image/PDF downloads.
5. Check `data/asset_download_log.csv`; only publish files with successful download status and verified reuse rights.

## Validation
SQLite foreign-key validation: **passed**.
