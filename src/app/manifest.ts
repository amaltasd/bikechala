import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const icon = [{ src: '/icons/icon-192.png', sizes: '192x192' }];
  return {
    id: '/',
    name: 'BikeChala – Bikes, Scooters & Prices in India',
    short_name: 'BikeChala',
    description: 'Compare bikes and scooters in India: prices, specs, mileage, range and handy calculators.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#ea580c',
    lang: 'en-IN',
    categories: ['automotive', 'utilities'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Browse Bikes', short_name: 'Bikes', url: '/bikes?source=pwa', icons: icon },
      { name: 'Compare Bikes', short_name: 'Compare', url: '/compare?source=pwa', icons: icon },
      { name: 'EMI Calculator', short_name: 'EMI', url: '/tools/emi-calculator?source=pwa', icons: icon },
    ],
  };
}
