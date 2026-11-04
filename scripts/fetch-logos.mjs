// Fetch official brand logos for brands that do not have one yet. Run on a machine that can reach the brand sites:
//   npm run fetch-logos
// For each brand it opens the brand's homepage (src/data/brand-sites.json), takes the largest apple-touch-icon,
// else the og:image, saves it to public/logos/<brandSlug>.<ext> and records it in src/data/brand-logos.json.
// Always eyeball the results: a homepage icon is sometimes a photo, not a logo. Delete any you do not like
// and drop your own file in public/logos/ (then add it to brand-logos.json). Mind each brand's trademark terms.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const sitesPath = arg('sites', join(root, 'src/data/brand-sites.json'));
const mapPath = arg('map', join(root, 'src/data/brand-logos.json'));
const outDir = arg('out', join(root, 'public/logos'));
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' };

export function findLogoUrl(html, base) {
  const tags = html.match(/<link\b[^>]*>|<meta\b[^>]*>/gi) ?? [];
  const attr = (t, n) => (t.match(new RegExp(`${n}=["']([^"']+)["']`, 'i')) ?? [])[1];
  const icons = tags
    .filter((t) => /^<link/i.test(t) && /apple-touch-icon/i.test(attr(t, 'rel') ?? ''))
    .map((t) => ({ href: attr(t, 'href'), size: parseInt((attr(t, 'sizes') ?? '0').split('x')[0], 10) || 0 }))
    .filter((i) => i.href)
    .sort((a, b) => b.size - a.size);
  const og = tags.filter((t) => /^<meta/i.test(t) && /og:image/i.test(attr(t, 'property') ?? attr(t, 'name') ?? '')).map((t) => attr(t, 'content'))[0];
  const pick = icons[0]?.href ?? og;
  if (!pick) return null;
  try { return new URL(pick.replace(/&amp;/g, '&'), base).href; } catch { return null; }
}

async function get(url, accept) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: accept }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

function sniff(b) {
  if (b[0] === 0x89 && b.subarray(1, 4).toString() === 'PNG') return 'png';
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (b.subarray(0, 400).toString().includes('<svg')) return 'svg';
  return null;
}

async function main() {
  const sites = JSON.parse(readFileSync(sitesPath, 'utf8'));
  const map = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf8')) : {};
  mkdirSync(outDir, { recursive: true });
  let ok = 0;
  for (const [slug, site] of Object.entries(sites)) {
    if (map[slug]) continue;
    try {
      const html = await (await get(site, 'text/html')).text();
      const url = findLogoUrl(html, site);
      if (!url) throw new Error('no icon found on homepage');
      const res = await get(url, 'image/*');
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = sniff(buf);
      if (!ext || !EXT[`image/${ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext}`]) throw new Error('not an image');
      if (buf.length < 800) throw new Error(`too small (${buf.length} bytes)`);
      writeFileSync(join(outDir, `${slug}.${ext}`), buf);
      map[slug] = { src: `/logos/${slug}.${ext}`, mono: false, credit: new URL(url).hostname.replace(/^www\./, '') };
      ok++; console.log(`ok    ${slug} <- ${url}`);
    } catch (e) { console.log(`FAIL  ${slug}: ${e.message}`); }
  }
  writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n');
  console.log(`\n${ok} logos saved. ${Object.keys(map).length} brands now have one.`);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
