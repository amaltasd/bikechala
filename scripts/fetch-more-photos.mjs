import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'public/images/bikes';
const MAP_PATH = 'src/data/images.json';
const map = existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf8')) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TARGETS = [
  // TVS
  { slug: 'tvs-raider', wiki: 'TVS Raider 125' },
  { slug: 'tvs-ronin', wiki: 'TVS Ronin' },
  { slug: 'tvs-ntorq-125', wiki: 'TVS NTORQ 125' },
  { slug: 'tvs-iqube', wiki: 'TVS iQube Electric' },
  { slug: 'tvs-jupiter', wiki: 'TVS Jupiter' },
  { slug: 'tvs-apache-rtr-200-4v', wiki: 'TVS Apache' },

  // Suzuki
  { slug: 'suzuki-access-125', wiki: 'Suzuki Access 125' },
  { slug: 'suzuki-gixxer', wiki: 'Suzuki Gixxer' },
  { slug: 'suzuki-gixxer-sf', wiki: 'Suzuki Gixxer SF' },
  { slug: 'suzuki-v-strom-sx', wiki: 'Suzuki V-Strom 250' },
  { slug: 'suzuki-burgman-street', wiki: 'Suzuki Burgman' },
  { slug: 'suzuki-hayabusa', wiki: 'Suzuki Hayabusa' },

  // KTM
  { slug: 'ktm-250-duke', wiki: 'KTM 250 Duke' },
  { slug: 'ktm-rc-200', wiki: 'KTM RC 200' },
  { slug: 'ktm-rc-390', wiki: 'KTM RC 390' },
  { slug: 'ktm-390-adventure', wiki: 'KTM 390 series' },

  // Triumph
  { slug: 'triumph-speed-400', wiki: 'Triumph Speed 400' },
  { slug: 'triumph-scrambler-400-x', wiki: 'Triumph Speed 400' },

  // Hero
  { slug: 'hero-mavrick-440', wiki: 'Hero Mavrick 440' },
  { slug: 'hero-xpulse-200-4v', wiki: 'Hero XPulse 200' },
  { slug: 'hero-xtreme-125r', wiki: 'Hero Xtreme 125R' },
  { slug: 'hero-karizma-xmr', wiki: 'Hero Karizma XMR' },
  { slug: 'hero-destini-125', wiki: 'Hero Destini 125' },
  { slug: 'hero-glamour-x-125', wiki: 'Hero Glamour' },
  { slug: 'hero-passion-plus', wiki: 'Hero Passion' },

  // EV
  { slug: 'ather-450x', wiki: 'Ather 450X' },
  { slug: 'ather-450s', wiki: 'Ather 450' },
  { slug: 'ather-rizta', wiki: 'Ather Energy' },
  { slug: 'ola-electric-s1-pro', wiki: 'Ola S1' },
  { slug: 'ola-electric-s1-x', wiki: 'Ola S1' },
  { slug: 'ola-electric-s1-air', wiki: 'Ola S1' },
  { slug: 'river-indie', wiki: 'River Indie' },

  // Kawasaki
  { slug: 'kawasaki-ninja-300', wiki: 'Kawasaki Ninja 300' },
  { slug: 'kawasaki-ninja-500', wiki: 'Kawasaki Ninja 500' },
  { slug: 'kawasaki-ninja-650', wiki: 'Kawasaki Ninja 650' },
  { slug: 'kawasaki-z900', wiki: 'Kawasaki Z900' },
  { slug: 'kawasaki-z650', wiki: 'Kawasaki Z650' },
  { slug: 'kawasaki-ninja-zx-6r', wiki: 'Kawasaki Ninja ZX-6R' },
  { slug: 'kawasaki-w175', wiki: 'Kawasaki W175' },

  // Jawa & Yezdi & Harley & Ducati
  { slug: 'jawa-42', wiki: 'Jawa 42' },
  { slug: 'jawa-perak', wiki: 'Jawa Perak' },
  { slug: 'yezdi-roadster', wiki: 'Yezdi Roadster' },
  { slug: 'harley-davidson-x440', wiki: 'Harley-Davidson X440' },
  { slug: 'ducati-monster', wiki: 'Ducati Monster' },
  { slug: 'aprilia-rs-457', wiki: 'Aprilia RS 457' },
  { slug: 'vespa-125', wiki: 'Vespa' }
];

function sniffExt(b) {
  const h = b.subarray(0, 12);
  if (h[0] === 0xff && h[1] === 0xd8) return 'jpg';
  if (h.subarray(0, 4).toString('hex') === '89504e47') return 'png';
  if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (h.subarray(4, 8).toString() === 'ftyp') return 'avif';
  return 'jpg';
}

async function getWikiThumb(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=900`;
  const res = await fetch(url, { headers: { 'User-Agent': 'BikeChalaBot/1.0 (contact@bikechala.com)' } });
  if (!res.ok) return null;
  const d = await res.json();
  const page = Object.values(d.query?.pages || {})[0];
  return page?.thumbnail?.source || null;
}

async function run() {
  let ok = 0;
  for (const item of TARGETS) {
    if (map[item.slug]) {
      console.log(`SKIP ${item.slug} (already has image)`);
      continue;
    }
    await sleep(800); // polite rate limit
    try {
      const imgUrl = await getWikiThumb(item.wiki);
      if (!imgUrl) {
        console.log(`NO THUMB ${item.slug} (${item.wiki})`);
        continue;
      }
      const res = await fetch(imgUrl, { headers: { 'User-Agent': 'BikeChalaBot/1.0' } });
      if (!res.ok) {
        console.log(`FETCH FAIL ${item.slug} (${res.status})`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) {
        console.log(`TOO SMALL ${item.slug} (${buf.length})`);
        continue;
      }
      const ext = sniffExt(buf);
      const filename = `${item.slug}.${ext}`;
      writeFileSync(join(OUT_DIR, filename), buf);
      map[item.slug] = {
        src: `/images/bikes/${filename}`,
        credit: `Wikipedia (${item.wiki})`,
        sourceUrl: imgUrl,
        fetchedAt: new Date().toISOString().slice(0, 10)
      };
      ok++;
      console.log(`OK ${item.slug} <- ${filename} (${(buf.length / 1024) | 0} KB)`);
    } catch (e) {
      console.log(`ERR ${item.slug}: ${e.message}`);
    }
  }
  writeFileSync(MAP_PATH, JSON.stringify(map, null, 1) + '\n', 'utf8');
  console.log(`\nFinished! Added ${ok} images. Total in images.json: ${Object.keys(map).length}`);
}

run();
