// Download official OEM images for models that have an imageUrl (or, with --og, a model page with an og:image).
// Run from a machine that can reach the manufacturer sites:  npm run fetch-images
// Writes public/images/bikes/<slug>.<ext> and src/data/images.json (slug -> { src, credit, sourceUrl, fetchedAt }).
// Licensing: the site owner has decided these may be used; keep images.json, it records where each file came from.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };

const bikesPath = opt('bikes', join(root, 'src/data/bikes.json'));
const mapPath = opt('map', join(root, 'src/data/images.json'));
const outDir = opt('out', join(root, 'public/images/bikes'));
const useOg = flag('og');
const force = flag('force');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif' };
const MIN = 4 * 1024, MAX = 8 * 1024 * 1024;

export function findOgImage(html, base) {
  const tag = html.match(/<meta[^>]+(?:property|name)=["']og:image(?::url)?["'][^>]*>/i);
  if (!tag) return null;
  const content = tag[0].match(/content=["']([^"']+)["']/i);
  if (!content) return null;
  try { return new URL(content[1].replace(/&amp;/g, '&'), base).href; } catch { return null; }
}

// Servers sometimes send an HTML error page with an image content-type; check the file signature too.
function looksLike(b, ext) {
  const h = b.subarray(0, 12);
  if (ext === 'jpg') return h[0] === 0xff && h[1] === 0xd8;
  if (ext === 'png') return h.subarray(0, 4).toString('hex') === '89504e47';
  if (ext === 'gif') return h.subarray(0, 3).toString() === 'GIF';
  if (ext === 'webp') return h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP';
  if (ext === 'avif') return h.subarray(4, 8).toString() === 'ftyp';
  return false;
}

async function get(url, accept) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: accept }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

async function download(url) {
  const res = await get(url, 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8');
  const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const ext = EXT[type];
  if (!ext) throw new Error(`not an image (${type || 'no content-type'})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!looksLike(buf, ext)) throw new Error(`content is not really ${ext}`);
  if (buf.length < MIN) throw new Error(`too small (${buf.length} bytes)`);
  if (buf.length > MAX) throw new Error(`too large (${buf.length} bytes)`);
  return { buf, ext };
}

async function resolveUrl(b) {
  if (b.imageUrl) return { url: b.imageUrl, how: 'direct' };
  if (useOg && b.officialUrlIsModelPage && b.officialUrl) {
    const html = await (await get(b.officialUrl, 'text/html')).text();
    const og = findOgImage(html, b.officialUrl);
    if (og) return { url: og, how: 'og:image' };
  }
  return null;
}

async function main() {
  const bikes = JSON.parse(readFileSync(bikesPath, 'utf8'));
  const map = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf8')) : {};
  mkdirSync(outDir, { recursive: true });
  const todo = bikes.filter((b) => (b.imageUrl || (useOg && b.officialUrlIsModelPage)) && (force || !map[b.slug]));
  const log = [];
  let ok = 0;
  const queue = [...todo];
  const worker = async () => {
    for (let b; (b = queue.shift()); ) {
      try {
        const r = await resolveUrl(b);
        if (!r) throw new Error('no image URL found');
        const { buf, ext } = await download(r.url);
        const file = `${b.slug}.${ext}`;
        writeFileSync(join(outDir, file), buf);
        map[b.slug] = { src: `/images/bikes/${file}`, credit: new URL(r.url).hostname.replace(/^www\./, ''), sourceUrl: r.url, fetchedAt: new Date().toISOString().slice(0, 10) };
        ok++; log.push(`ok    ${b.slug} (${r.how}, ${(buf.length / 1024) | 0} KB)`);
      } catch (e) {
        log.push(`FAIL  ${b.slug}: ${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  writeFileSync(mapPath, JSON.stringify(map, null, 1) + '\n');
  console.log(log.sort().join('\n'));
  console.log(`\n${ok}/${todo.length} downloaded. ${Object.keys(map).length} bikes now have an image.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
