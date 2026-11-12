'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, Check } from 'lucide-react';
import { useCity, POPULAR_CITIES, ALL_CITIES } from './CityStore';

export default function CityModal() {
  const { city, setCityByName, isModalOpen, closeCityModal } = useCity();
  const [query, setQuery] = useState('');

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
  }, [query]);

  if (!isModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={closeCityModal}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl transition-all sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </span>
              <h2 id="city-modal-title" className="text-xl font-bold tracking-tight text-foreground">
                Select Your City
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Personalises on-road bike prices, state RTO taxes, and dealer estimates.
            </p>
          </div>
          <button
            onClick={closeCityModal}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your city, e.g. Mumbai, Bengaluru, Pune..."
            autoFocus
            className="h-11 w-full rounded-2xl border border-border bg-muted/40 pl-10 pr-4 text-sm font-medium focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Search Results Dropdown (if user is typing) */}
        {query.trim().length > 0 ? (
          <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border border-border bg-muted/20 p-2">
            {filteredCities.length > 0 ? (
              <div className="space-y-1">
                {filteredCities.map((c) => {
                  const isSelected = c.name.toLowerCase() === city.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setCityByName(c.name);
                        setQuery('');
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <span>
                        {c.name}{' '}
                        <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          ({c.state})
                        </span>
                      </span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No cities found matching &ldquo;{query}&rdquo;. Select from popular metros below.
              </div>
            )}
          </div>
        ) : (
          /* Popular Cities Grid (BikeWale / BikeDekho Style) */
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Popular Cities
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {POPULAR_CITIES.map((c) => {
                const isSelected = c.name.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={c.name}
                    onClick={() => setCityByName(c.name)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition-all active:scale-95 ${
                      isSelected
                        ? 'border-primary bg-primary/10 font-bold text-primary shadow-xs'
                        : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xs font-bold">{c.name}</span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">{c.state}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Current selection: <span className="font-semibold text-foreground">{city}</span>. Road tax rates and on-road prices update automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
