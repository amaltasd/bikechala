#!/usr/bin/env python3
"""Merge a price sheet into src/data/bikes.json.

Usage: python3 scripts/import_prices.py data-raw/prices-2026-11-04.xlsx
Needs openpyxl. Existing models get the new price; models not yet in the dataset are
added as price-only records (specsPending: true) until their specs are researched.
"""
import json, re, sys
import openpyxl

PATH = sys.argv[1] if len(sys.argv) > 1 else 'data-raw/prices-2026-11-04.xlsx'
DATA = 'src/data/bikes.json'
OK = {'VERIFIED', 'VERIFIED / LISTED'}
CATEGORY = {
    'premium': 'naked', 'roadster': 'naked', 'classic': 'cruiser', 'touring': 'cruiser','motorcycle': 'commuter', 'scrambler': 'adventure', 'moped': 'commuter'}
MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

slugify = lambda s: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')
key = lambda brand, name: (brand.strip().lower(), re.sub(r'\s+', ' ', name.strip().lower()))

def as_of(text):
    m = re.match(r'(\d{1,2})-([A-Za-z]{3})-(\d{4})', text or '')
    return f'{int(m.group(1))} {m.group(2).title()} {m.group(3)}' if m else (text or None)

ws = openpyxl.load_workbook(PATH, data_only=True).active
rows = list(ws.iter_rows(values_only=True))
hdr = rows[0]
sheet = [dict(zip(hdr, r)) for r in rows[1:] if any(r)]
PRICE = next(h for h in hdr if h.startswith('Latest verified price'))

bikes = json.load(open(DATA, encoding='utf-8'))
by_key = {key(b['brand'], b['name']): b for b in bikes}
slugs = {b['slug'] for b in bikes}
updated = added = 0

def note_for(status, notes):
    if status not in OK:
        return notes or None
    if notes and 'rounded' in notes.lower():
        return 'Rounded listing price; confirm the exact figure with your dealer.'
    return None

for r in sheet:
    brand, name = r['Brand'].strip(), r['Model'].strip()
    status = (r['Verification status'] or '').strip()
    price = int(float(r[PRICE])) if r[PRICE] not in (None, '') else None
    url = r['Source URL']
    note = note_for(status, r['Notes'])
    b = by_key.get(key(brand, name))

    if b:  # existing model: take the new price, keep all researched specs
        b['exShowroomPriceInr'] = price
        b['priceAsOf'] = as_of(r['Verified as of'])
        old = b.get('priceNote')
        if note:
            b['priceNote'] = f'{old} {note}'.strip() if old and note not in old else note
        if url and url not in b['sources']:
            b['sources'].insert(0, url)
        updated += 1
    else:  # new model: price only
        brand_slug, model_slug = slugify(brand), slugify(name)
        slug = f'{brand_slug}-{model_slug}'
        assert slug not in slugs, f'duplicate slug {slug}'
        slugs.add(slug)
        cat = (r['Category'] or '').strip().lower()
        bikes.append({
            'brand': brand, 'brandSlug': brand_slug, 'name': name, 'modelSlug': model_slug, 'slug': slug,
            'category': CATEGORY.get(cat, cat), 'fuelType': (r['Fuel'] or 'petrol').strip().lower(),
            'exShowroomPriceInr': price, 'priceAsOf': as_of(r['Verified as of']),
            **({'priceNote': note} if note else {}),
            'highlights': [], 'summary': '', 'specsPending': True,
            'sources': [url] if url else [],
        })
        added += 1

json.dump(bikes, open(DATA, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(f'updated {updated}, added {added}, total {len(bikes)}')
