import { ImageResponse } from 'next/og';
import { getBike, bikeTitle, formatPrice, keyStats, CATEGORY_LABEL } from '@/lib/bikes';

export const alt = 'Bike price and specs on BikeChala';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand, model } = await params;
  const b = getBike(brand, model);
  const title = b ? bikeTitle(b) : 'BikeChala';
  const price = b ? formatPrice(b.exShowroomPriceInr) : null;
  const stats = b ? keyStats(b) : [];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1020', color: '#fff', padding: 72 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 800 }}>
          <div style={{ display: 'flex' }}><span>Bike</span><span style={{ color: '#f97316' }}>Chala</span></div>
          <div style={{ display: 'flex', color: '#94a3b8', fontWeight: 600 }}>{b ? CATEGORY_LABEL[b.category] : ''}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: title.length > 28 ? 68 : 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 52, fontWeight: 800, color: '#f97316' }}>
            {price ? `${price} ex-showroom` : 'Price not confirmed'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, fontSize: 32, color: '#cbd5e1' }}>
          {stats.map((s) => <div key={s.label} style={{ display: 'flex' }}>{`${s.label}: ${s.value}`}</div>)}
        </div>
      </div>
    ),
    size,
  );
}
