#!/usr/bin/env python3
"""Merge the BikeChala Complete Package (data-raw/package) into src/data/bikes.json.

Adds, per model: official links, listing status, manufacturer-listed spec text, key features and variants.
New models in the package are added as records. Existing researched numeric specs and prices are kept.
Run: python3 scripts/import_package.py
"""
import csv, json, re
from collections import defaultdict

PKG = 'data-raw/package'
DATA = 'src/data/bikes.json'
SPEC_COLS = ['Engine / motor type', 'Displacement (cc)', 'Peak power', 'Peak torque', 'Transmission', 'Fuel system / cooling',
             'Claimed mileage / IDC range', 'Battery capacity (kWh)', 'Charging time', 'Top speed (km/h)', 'Brakes / ABS',
             'Front suspension', 'Rear suspension', 'Kerb weight (kg)', 'Seat height (mm)', 'Fuel tank / energy capacity']
NUMERIC = ['engineCc', 'powerPs', 'torqueNm', 'mileageKmpl', 'rangeKm', 'batteryKwh', 'kerbWeightKg', 'topSpeedKmph', 'motorPowerKw']
OK = {'VERIFIED', 'VERIFIED / LISTED'}
CATEGORY = {'motorcycle': 'commuter'}

slugify = lambda s: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')
key = lambda brand, name: (brand.strip().lower(), re.sub(r'\s+', ' ', name.strip().lower()))

def as_of(text):
    m = re.match(r'(\d{1,2})-([A-Za-z]{3})-(\d{4})', text or '')
    return f'{int(m.group(1))} {m.group(2).title()} {m.group(3)}' if m else None

def to_int(v):
    v = (v or '').strip().replace(',', '')
    return int(float(v)) if re.fullmatch(r'\d+(\.\d+)?', v) else None

def status_code(text):
    t = (text or '').lower()
    if 'pre-book' in t or 'upcoming' in t:
        return 'prebook'
    if 'entry point only' in t or 'needs verification' in t:
        return 'unverified'
    return 'listed'

master = json.load(open(f'{PKG}/models_master.json', encoding='utf-8'))
bikes = json.load(open(DATA, encoding='utf-8'))
by_key = {key(b['brand'], b['name']): b for b in bikes}
slugs = {b['slug'] for b in bikes}
id_to_key = {r['Model ID']: key(r['Brand'], r['Model']) for r in master}

# variants and brochures, keyed by parent model
variants = defaultdict(list)
for v in csv.DictReader(open(f'{PKG}/variants.csv', encoding='utf-8-sig')):
    k = id_to_key.get(v['Parent Model ID'])
    if not k:
        continue
    item = {
        'name': v['Variant / trim'].strip() or None,
        'price': to_int(v['Variant ex-showroom price (INR)']),
        'battery': v['Battery capacity (kWh)'].strip() or None,
        'range': v['Claimed range / mileage'].strip() or None,
        'topSpeed': v['Top speed (km/h)'].strip() or None,
        'charging': v['Charging time'].strip() or None,
        'features': [f.strip() for f in v['Variant-specific features'].split(';') if f.strip()],
        'sourceUrl': v['OEM source URL'].strip() or None,
    }
    variants[k].append({a: b for a, b in item.items() if b not in (None, [], '')})

brochures = {}
for a in csv.DictReader(open(f'{PKG}/media_assets.csv', encoding='utf-8-sig')):
    if a['Asset type'].startswith('Official brochure'):
        brochures[id_to_key.get(a['Model ID'])] = a['URL'].strip()

added = enriched = price_mismatch = 0
mismatches = []
for r in master:
    k = key(r['Brand'], r['Model'])
    b = by_key.get(k)
    price = to_int(r['Latest verified price (Rs, ex-showroom)'])
    status = r['Verification status'].strip()

    if b is None:  # model only the package knows about
        brand_slug, model_slug = slugify(r['Brand'].strip()), slugify(r['Model'].strip())
        slug = f'{brand_slug}-{model_slug}'
        assert slug not in slugs, f'duplicate slug {slug}'
        slugs.add(slug)
        cat = r['Category'].strip().lower()
        b = {
            'brand': r['Brand'].strip(), 'brandSlug': brand_slug, 'name': r['Model'].strip(), 'modelSlug': model_slug, 'slug': slug,
            'category': CATEGORY.get(cat, cat), 'fuelType': r['Fuel'].strip().lower(),
            'exShowroomPriceInr': price, 'priceAsOf': as_of(r['Verified as of']),
            'highlights': [], 'summary': '', 'sources': [],
        }
        if status not in OK and r['Notes'].strip():
            b['priceNote'] = r['Notes'].strip()
        bikes.append(b)
        by_key[k] = b
        added += 1
    else:
        enriched += 1
        if b['exShowroomPriceInr'] != price and not (b['exShowroomPriceInr'] is None and price is None):
            price_mismatch += 1
            mismatches.append((b['slug'], b['exShowroomPriceInr'], price))

    model_page = r['OEM model page'].strip()
    official = model_page or r['Official product page / brand catalogue (image entry point)'].strip()
    if official:
        b['officialUrl'] = official
        b['officialUrlIsModelPage'] = bool(model_page)
    img = re.split(r'[;|\s]+', r['Direct official image URL(s)'].strip())[0]
    if img.startswith('http'):
        b['imageUrl'] = img
    if brochures.get(k):
        b['brochureUrl'] = brochures[k]
    b['listingStatus'] = status_code(r['India OEM listing status'])

    specs = [{'label': c, 'value': r[c].strip()} for c in SPEC_COLS if r[c].strip()]
    if specs:
        b['officialSpecs'] = specs
        b['officialSpecsSource'] = {'url': r['Official specs source URL'].strip() or None, 'status': r['Spec verification status'].strip() or None}
        b['officialSpecsSource'] = {a: v for a, v in b['officialSpecsSource'].items() if v}
    feats = [f.strip() for f in r['Key manufacturer features'].split(';') if f.strip()]
    if feats:
        b['keyFeatures'] = feats
    if variants.get(k):
        b['variants'] = variants[k]
    src = r['Official specs source URL'].strip()
    if src and src not in b['sources']:
        b['sources'].append(src)

for b in bikes:
    has_numbers = any(b.get(n) is not None for n in NUMERIC)
    if has_numbers or b.get('officialSpecs'):
        b.pop('specsPending', None)
    else:
        b['specsPending'] = True

json.dump(bikes, open(DATA, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(f'added {added}, enriched {enriched}, total {len(bikes)}')
print(f'price mismatches vs earlier sheet: {price_mismatch}', mismatches[:6])
print('with official specs:', sum(1 for b in bikes if b.get('officialSpecs')), '| variants:', sum(1 for b in bikes if b.get('variants')),
      '| pending specs:', sum(1 for b in bikes if b.get('specsPending')), '| brochures:', sum(1 for b in bikes if b.get('brochureUrl')),
      '| listing status:', {s: sum(1 for b in bikes if b.get('listingStatus') == s) for s in ('listed', 'unverified', 'prebook')})
