import { brandLogo } from '@/lib/bikes';

/**
 * Official brand mark when we have one (src/data/brand-logos.json), otherwise the brand name set in type.
 * Single-colour marks are inverted in dark mode so they stay visible.
 */
export default function BrandLogo({ brand, brandSlug, className = 'h-8 w-8', textClassName = 'text-sm' }: { brand: string; brandSlug: string; className?: string; textClassName?: string }) {
  const logo = brandLogo(brandSlug);
  if (!logo) {
    return <span aria-label={brand} className={`inline-flex items-center justify-center text-center font-display font-extrabold leading-tight tracking-tight ${textClassName}`}>{brand}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo.src} alt={`${brand} logo`} loading="lazy" decoding="async" className={`object-contain ${logo.mono ? 'dark:invert' : ''} ${className}`} />
  );
}
