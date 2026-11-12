'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Fuel, Compass, ShieldCheck } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { type Bike } from '@/lib/bike-core';

type TabKey = 'popular' | 'electric' | 'mileage' | 'cruiser' | 'sports' | 'scooter' | 'under1lakh' | 'under2lakh';

interface HomeCategorySectionProps {
  allBikes: Bike[];
}

const TABS: { id: TabKey; label: string; icon?: React.ElementType }[] = [
  { id: 'popular', label: 'Popular 2026', icon: Sparkles },
  { id: 'electric', label: 'Electric Scooters', icon: Zap },
  { id: 'mileage', label: 'Best Mileage', icon: Fuel },
  { id: 'sports', label: 'Sports & Naked' },
  { id: 'cruiser', label: 'Cruisers' },
  { id: 'scooter', label: 'Petrol Scooters' },
  { id: 'under1lakh', label: 'Under ₹1 Lakh' },
  { id: 'under2lakh', label: 'Under ₹2 Lakh' },
];

export default function HomeCategorySection({ allBikes }: HomeCategorySectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('popular');

  const filteredBikes = useMemo(() => {
    switch (activeTab) {
      case 'popular': {
        const slugs = ['honda-shine', 'royal-enfield-classic-350', 'tvs-apache-rtr-160-4v', 'bajaj-pulsar-n160', 'ather-rizta', 'hero-splendor-plus'];
        const matched = slugs.map((s) => allBikes.find((b) => b.slug === s)).filter((b): b is Bike => !!b);
        return matched.length >= 6 ? matched : allBikes.slice(0, 6);
      }
      case 'electric': {
        return allBikes.filter((b) => b.fuelType === 'electric').slice(0, 6);
      }
      case 'mileage': {
        return [...allBikes]
          .filter((b) => b.fuelType === 'petrol' && b.mileageKmpl != null)
          .sort((a, b) => (b.mileageKmpl ?? 0) - (a.mileageKmpl ?? 0))
          .slice(0, 6);
      }
      case 'sports': {
        return allBikes
          .filter((b) => b.category === 'sports' || b.category === 'naked')
          .slice(0, 6);
      }
      case 'cruiser': {
        return allBikes.filter((b) => b.category === 'cruiser').slice(0, 6);
      }
      case 'scooter': {
        return allBikes
          .filter((b) => b.category === 'scooter' && b.fuelType === 'petrol')
          .slice(0, 6);
      }
      case 'under1lakh': {
        return allBikes
          .filter((b) => b.exShowroomPriceInr != null && b.exShowroomPriceInr <= 100000)
          .sort((a, b) => (b.exShowroomPriceInr ?? 0) - (a.exShowroomPriceInr ?? 0))
          .slice(0, 6);
      }
      case 'under2lakh': {
        return allBikes
          .filter((b) => b.exShowroomPriceInr != null && b.exShowroomPriceInr > 100000 && b.exShowroomPriceInr <= 200000)
          .sort((a, b) => (b.exShowroomPriceInr ?? 0) - (a.exShowroomPriceInr ?? 0))
          .slice(0, 6);
      }
      default:
        return allBikes.slice(0, 6);
    }
  }, [activeTab, allBikes]);

  const viewAllHref = useMemo(() => {
    switch (activeTab) {
      case 'electric':
        return '/best/best-electric-scooters';
      case 'mileage':
        return '/best/best-mileage-bikes';
      case 'cruiser':
        return '/best/best-cruiser-bikes';
      case 'scooter':
        return '/bikes?category=scooter';
      case 'under1lakh':
        return '/best/best-bikes-under-1-lakh';
      case 'under2lakh':
        return '/best/best-bikes-under-2-lakh';
      case 'sports':
        return '/bikes?category=sports';
      default:
        return '/bikes';
    }
  }, [activeTab]);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Compass className="h-4 w-4" />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Popular Two-Wheelers in India 2026
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore top-selling motorcycles and electric scooters with verified ex-showroom and on-road prices.
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:underline"
        >
          <span>View all in category</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Interactive Horizontal Category Filter Tabs (BikeWale / BikeDekho Style) */}
      <div className="mb-6 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Grid of Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBikes.map((bike) => (
          <BikeCard key={bike.slug} bike={bike} />
        ))}
      </div>
    </section>
  );
}
