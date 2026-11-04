export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bikechala.com').replace(/\/$/, '');
export const SITE_NAME = 'BikeChala';
export const absoluteUrl = (p = '/') => (/^https?:\/\//i.test(p) ? p : `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`);
