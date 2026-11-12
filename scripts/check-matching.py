import json

bikes = json.load(open('src/data/bikes.json', encoding='utf-8'))
for b in sorted(bikes, key=lambda x: x['slug']):
    slug = b['slug']
    if any(k in slug for k in ['passion', 'f250', '310', 'x440', 'speed-400', 'svartpilen', 'karizma', 'ronin', 'hunter']):
        print(f"{b['brand']} | {b['name']} | {b['slug']}")
