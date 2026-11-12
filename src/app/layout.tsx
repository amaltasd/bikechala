import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PwaClient from "@/components/PwaClient";
import { CompareProvider } from "@/components/CompareStore";
import { CityProvider } from "@/components/CityStore";
import CompareTray from "@/components/CompareTray";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const displayFont = Outfit({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const bodyFont = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "BikeChala",
  appleWebApp: { capable: true, title: "BikeChala", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  title: {
    default: "New Bikes in India 2026: Prices, Specs, Mileage & Comparisons | BikeChala",
    template: "%s | BikeChala",
  },
  description: "Find and compare new bikes and scooters in India. Accurate ex-showroom prices, verified mileage, electric vehicle range, specifications, and EMI & fuel cost calculators.",
  keywords: [
    "new bikes in India",
    "bikes price 2026",
    "two wheeler prices India",
    "compare bikes",
    "best mileage bikes",
    "electric scooters India",
    "bike EMI calculator",
    "on road price calculator",
  ],
  authors: [{ name: "BikeChala Editorial Team", url: SITE_URL }],
  creator: "BikeChala",
  publisher: "BikeChala",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    url: SITE_URL,
    title: "New Bikes in India 2026: Prices, Specs & Comparisons | BikeChala",
    description: "Compare two-wheelers in India: ex-showroom prices, mileage, range, specs, and on-road calculators.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "BikeChala - India's Two-Wheeler Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Bikes in India 2026: Prices & Specs | BikeChala",
    description: "Compare new bikes and scooters in India with verified specs, prices, and mileage.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} flex min-h-screen flex-col font-sans antialiased`}>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icons/icon-512.png`,
              sameAs: [
                'https://twitter.com/bikechala',
                'https://facebook.com/bikechala',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: 'en-IN',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/bikes?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            },
          ]}
        />
        <CompareProvider>
          <CityProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" />
            <BottomNav />
            <CompareTray />
            <PwaClient />
          </CityProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
