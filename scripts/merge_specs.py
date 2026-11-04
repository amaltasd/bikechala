#!/usr/bin/env python3
"""Merge a researched spec batch (JSON keyed by slug) into src/data/bikes.json.

Conservative rules: skips entries marked status "unconfirmed"; never touches price; only fills fields that are
currently empty; drops brake/ABS fields when the researcher's notes flag a conflict or inference; appends sources.
Run: python3 scripts/merge_specs.py path/to/specs_batch.json
"""
import json, re, sys

DATA = 'src/data/bikes.json'
FIELDS = ['engineCc', 'powerPs', 'torqueNm', 'mileageKmpl', 'gearbox', 'fuelTankL', 'startType', 'kerbWeightKg', 'seatHeightMm',
          'frontBrake', 'rearBrake', 'abs', 'batteryKwh', 'rangeKm', 'motorPowerKw', 'topSpeedKmph', 'chargingTime0to80', 'batteryWarranty']
BRAKE = ['frontBrake', 'rearBrake', 'abs']
NUMERIC = ['engineCc', 'powerPs', 'torqueNm', 'mileageKmpl', 'rangeKm', 'batteryKwh', 'motorPowerKw']

bikes = json.load(open(DATA, encoding='utf-8'))
by = {b['slug']: b for b in bikes}
batch = json.load(open(sys.argv[1], encoding='utf-8'))
merged, skipped = [], []

for slug, s in batch.items():
    b = by.get(slug)
    if not b: skipped.append((slug, 'unknown slug')); continue
    if s.get('status') == 'unconfirmed': skipped.append((slug, 'unconfirmed')); continue
    notes = s.get('notes') or ''
    drop = set(BRAKE) if re.search(r'conflict|inferred|not stated|mismatch|differ', notes, re.I) and re.search(r'brake|CBS|ABS', notes, re.I) else set()
    n = 0
    for f in FIELDS:
        v = s.get(f)
        if v in (None, '') or f in drop or b.get(f) not in (None, ''): continue
        b[f] = v; n += 1
    if s.get('summary') and not b.get('summary'): b['summary'] = s['summary']
    if s.get('highlights') and not b.get('highlights'): b['highlights'] = s['highlights']
    for u in s.get('sources') or []:
        if u not in b['sources']: b['sources'].append(u)
    if any(b.get(f) is not None for f in NUMERIC):
        b['specsPending'] = False
    merged.append((slug, n, sorted(drop)))

json.dump(bikes, open(DATA, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
for m in merged: print('merged', *m)
for s in skipped: print('skipped', *s)
