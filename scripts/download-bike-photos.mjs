import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'public/images/bikes';
const MAP_PATH = 'src/data/images.json';
mkdirSync(OUT_DIR, { recursive: true });

const imagesMap = existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf8')) : {};

const BIKE_IMAGE_CATALOG = {
  // Yamaha
  'yamaha-fz-s-fi': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/FZ_Series/Thumbnail/fzs-fi.webp',
  'yamaha-fzs-fi-v4': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/FZ_Series/Thumbnail/Fzs-fi-v4-dlx-vermillion.webp',
  'yamaha-fz-fi': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/FZ_Series/Thumbnail/fz-fi.webp',
  'yamaha-fz-x': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/FZ_Series/Thumbnail/fzs-fi-hybrid.webp',
  'yamaha-r15-v4': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/R_Series/Thumbnail/r15v4-blue.webp',
  'yamaha-r15s': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/R_Series/Thumbnail/r15s-black.webp',
  'yamaha-mt-15-v2': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/MT_Series/Thumbnail/MT15.webp',
  'yamaha-xsr-155': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/X_Series/Thumbnail/xsr.webp',
  'yamaha-aerox-155': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/Maxi/Thumbnail/aerox155.webp',
  'yamaha-rayzr-125-fi-hybrid': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/Street/Thumbnail/rayZR.webp',
  'yamaha-fascino-125-fi-hybrid': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/Fashion/Thumbnail/fascinoS_thumbnail.webp',
  'yamaha-aerox-e': 'https://www.yamaha-motor-india.com/theme/v4/images/webp_images/home/select_your_bike/ev/Thumbnail/aerox_e.webp',

  // Royal Enfield
  'royal-enfield-classic-350': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/classic-350.webp',
  'royal-enfield-bullet-350': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/bullet-350.webp',
  'royal-enfield-hunter-350': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/hunter-350.webp',
  'royal-enfield-meteor-350': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/meteor-350-new.webp',
  'royal-enfield-classic-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/classic-650.webp',
  'royal-enfield-shotgun-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/shotgun-650.webp',
  'royal-enfield-interceptor-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/interceptor-650.webp',
  'royal-enfield-continental-gt-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/continental-gt.webp',
  'royal-enfield-super-meteor-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/super-meteor-650.webp',
  'royal-enfield-himalayan-450': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/new-himalayan.webp',
  'royal-enfield-guerrilla-450': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/guerrilla-450.webp',
  'royal-enfield-bear-650': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/bear-650.webp',
  'royal-enfield-goan-classic-350': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/goan-classic-350.webp',
  'royal-enfield-scram-440': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/scram-440.webp',
  'royal-enfield-himalayan-440': 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/himalayan-440.webp',

  // Bajaj
  'bajaj-pulsar-ns200': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/ns200.webp',
  'bajaj-pulsar-150': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/pulsar-150.webp',
  'bajaj-pulsar-n160': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/n160.webp',
  'bajaj-pulsar-ns400z': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/ns400z.webp',
  'bajaj-pulsar-rs200': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/rs200.webp',
  'bajaj-dominar-400': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/dominar-400.webp',
  'bajaj-dominar-250': 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/dominar-250.webp',
  'bajaj-freedom-125': 'https://cdn.bajajauto.com/-/media/images/bajajauto/bajaj-price-page/header-drop-down/webp/freedom-ng04-disc.webp',

  // Hero
  'hero-xtreme-160r-4v': 'https://www.heromotocorp.com/content/dam/hero-eds-website/xtreme-160r-4v-new-layout/find-your-ride-xtreme-160r-4v.png',
  'hero-splendor-plus': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Hero_Honda_Splendor_2007.jpg',
  'hero-mavrick-440': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Hero_Mavrick_440.jpg',
  'hero-xpulse-200-4v': 'https://upload.wikimedia.org/wikipedia/commons/0/03/Hero_XPulse_200_4V.jpg',
  'hero-xtreme-125r': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Hero_Xtreme_125R.jpg',

  // TVS
  'tvs-apache-rtr-160': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Apache_RTR_160.jpg',
  'tvs-apache-rtr-160-4v': 'https://upload.wikimedia.org/wikipedia/commons/5/52/TVS_Apache_RTR_160_4V.jpg',
  'tvs-apache-rtr-180': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Apache_RTR_160.jpg',
  'tvs-apache-rtr-310': 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Apache_rtr_310.jpg',
  'tvs-raider': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/TVS_Raider.jpg',
  'tvs-radeon': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/TVS_Radeon_01.jpg',
  'tvs-ntorq-125': 'https://upload.wikimedia.org/wikipedia/commons/3/30/TVS_Ntorq_front.jpg',
  'tvs-ronin': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/TVS_Ronin.jpg',
  'tvs-iqube': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/TVS_iQube_Electric_Scooter.jpg',

  // KTM
  'ktm-390-duke': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Ktm_duke_390.jpg',
  'ktm-250-duke': 'https://upload.wikimedia.org/wikipedia/commons/5/50/KTM_250_Duke.jpg',
  'ktm-rc-390': 'https://upload.wikimedia.org/wikipedia/commons/0/07/KTM_RC_390_Track.jpg',

  // Suzuki
  'suzuki-access-125': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Suzuki_Access_125_Special_Edition.jpg',
  'suzuki-gixxer': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Suzuki_Gixxer_155.jpg',
  'suzuki-v-strom-sx': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Suzuki_V-Strom_SX_250.jpg',
  'suzuki-burgman-street': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Suzuki_Burgman_Street_125.jpg',

  // Triumph
  'triumph-speed-400': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Triumph_Speed_400_Phantom_Black.jpg',
  'triumph-scrambler-400-x': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Triumph_Scrambler_400_X.jpg',

  // Ather & Ola
  'ather-450x': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Ather_450X_Gen_3.jpg',
  'ather-rizta': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Ather_Rizta_Electric_Scooter.jpg',
  'ola-electric-s1-pro': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Ola_S1_Pro_Electric_Scooter.jpg',

  // Kawasaki
  'kawasaki-ninja-650': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Kawasaki_Ninja_650_2020.jpg',
  'kawasaki-z650': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Kawasaki_Z650_2021.jpg',
  'kawasaki-ninja-zx-6r': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Kawasaki_Ninja_ZX-6R_2024.jpg',
  'kawasaki-w175': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Kawasaki_W175_SE.jpg',

  // Jawa & Yezdi & Harley & Ducati
  'jawa-42': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Jawa_42_motorcycle.jpg',
  'jawa-perak': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Jawa_Perak_Bobber.jpg',
  'yezdi-roadster': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Yezdi_Roadster.jpg',
  'harley-davidson-x440': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Harley-Davidson_X440.jpg',
  'ducati-monster': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Ducati_Monster_937.jpg'
};

function sniffExt(b) {
  const h = b.subarray(0, 12);
  if (h[0] === 0xff && h[1] === 0xd8) return 'jpg';
  if (h.subarray(0, 4).toString('hex') === '89504e47') return 'png';
  if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (h.subarray(4, 8).toString() === 'ftyp') return 'avif';
  return 'jpg';
}

async function run() {
  let count = 0;
  for (const [slug, url] of Object.entries(BIKE_IMAGE_CATALOG)) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) {
        console.log(`FAIL ${slug} (${res.status})`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) {
        console.log(`FAIL ${slug} (too small: ${buf.length})`);
        continue;
      }
      const ext = sniffExt(buf);
      const filename = `${slug}.${ext}`;
      writeFileSync(join(OUT_DIR, filename), buf);
      imagesMap[slug] = {
        src: `/images/bikes/${filename}`,
        credit: new URL(url).hostname.replace(/^www\./, ''),
        sourceUrl: url,
        fetchedAt: new Date().toISOString().slice(0, 10)
      };
      count++;
      console.log(`OK   ${slug} -> ${filename} (${(buf.length / 1024) | 0} KB)`);
    } catch (e) {
      console.log(`ERR  ${slug}: ${e.message}`);
    }
  }
  writeFileSync(MAP_PATH, JSON.stringify(imagesMap, null, 1) + '\n', 'utf8');
  console.log(`\nDone! Downloaded ${count} bike photos. Total in images.json: ${Object.keys(imagesMap).length}`);
}

run();
