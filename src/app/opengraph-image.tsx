import { ImageResponse } from 'next/og';
import { bikes, getBrands } from '@/lib/bikes';

export const alt = 'BikeChala: bike and scooter prices, specs and comparisons for India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1020', color: '#fff', padding: 72 }}>
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
          <span>Bike</span><span style={{ color: '#f97316' }}>Chala</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>What is your budget?</div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 34, color: '#cbd5e1' }}>
            {`${bikes.length} bikes and scooters from ${getBrands().length} brands. Prices, specs and comparisons.`}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#94a3b8' }}>bikechala.com</div>
      </div>
    ),
    size,
  );
}
