import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PwaClient from "@/components/PwaClient";
import { CompareProvider } from "@/components/CompareStore";
import CompareTray from "@/components/CompareTray";
import { SITE_URL } from "@/lib/seo";

const displayFont = Outfit({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const bodyFont = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  title: { default: "New Bikes & Scooters in India: Prices, Specs & Comparisons | BikeChala", template: "%s | BikeChala" },
  description: "Compare new bikes and scooters in India: ex-showroom prices, mileage, range, specs, EMI and running-cost calculators.",
  openGraph: { siteName: "BikeChala", locale: "en_IN", type: "website", url: SITE_URL },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <CompareProvider>
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        {/* keeps the footer clear of the fixed bottom tab bar on phones */}
        <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" />
        <BottomNav />
        <CompareTray />
        <PwaClient />
        </CompareProvider>
      </body>
    </html>
  );
}
