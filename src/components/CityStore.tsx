'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type IndianCity = {
  name: string;
  state: string;
  rtoRate: number; // percentage
  isMetro?: boolean;
};

export const POPULAR_CITIES: IndianCity[] = [
  { name: 'Delhi', state: 'Delhi', rtoRate: 8, isMetro: true },
  { name: 'Mumbai', state: 'Maharashtra', rtoRate: 10, isMetro: true },
  { name: 'Bengaluru', state: 'Karnataka', rtoRate: 12, isMetro: true },
  { name: 'Hyderabad', state: 'Telangana', rtoRate: 9, isMetro: true },
  { name: 'Chennai', state: 'Tamil Nadu', rtoRate: 8, isMetro: true },
  { name: 'Pune', state: 'Maharashtra', rtoRate: 10, isMetro: true },
  { name: 'Ahmedabad', state: 'Gujarat', rtoRate: 6, isMetro: true },
  { name: 'Kolkata', state: 'West Bengal', rtoRate: 8, isMetro: true },
  { name: 'Jaipur', state: 'Rajasthan', rtoRate: 9, isMetro: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', rtoRate: 8, isMetro: true },
  { name: 'Chandigarh', state: 'Punjab', rtoRate: 8, isMetro: true },
  { name: 'Surat', state: 'Gujarat', rtoRate: 6, isMetro: true },
];

export const ALL_CITIES: IndianCity[] = [
  ...POPULAR_CITIES,
  { name: 'Noida', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Gurugram', state: 'Haryana', rtoRate: 8 },
  { name: 'Faridabad', state: 'Haryana', rtoRate: 8 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Navi Mumbai', state: 'Maharashtra', rtoRate: 10 },
  { name: 'Thane', state: 'Maharashtra', rtoRate: 10 },
  { name: 'Nagpur', state: 'Maharashtra', rtoRate: 10 },
  { name: 'Nashik', state: 'Maharashtra', rtoRate: 10 },
  { name: 'Indore', state: 'Madhya Pradesh', rtoRate: 9 },
  { name: 'Bhopal', state: 'Madhya Pradesh', rtoRate: 9 },
  { name: 'Patna', state: 'Bihar', rtoRate: 9 },
  { name: 'Kochi', state: 'Kerala', rtoRate: 10 },
  { name: 'Thiruvananthapuram', state: 'Kerala', rtoRate: 10 },
  { name: 'Kozhikode', state: 'Kerala', rtoRate: 10 },
  { name: 'Coimbatore', state: 'Tamil Nadu', rtoRate: 8 },
  { name: 'Madurai', state: 'Tamil Nadu', rtoRate: 8 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', rtoRate: 9 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', rtoRate: 9 },
  { name: 'Vadodara', state: 'Gujarat', rtoRate: 6 },
  { name: 'Rajkot', state: 'Gujarat', rtoRate: 6 },
  { name: 'Bhubaneswar', state: 'Odisha', rtoRate: 8 },
  { name: 'Cuttack', state: 'Odisha', rtoRate: 8 },
  { name: 'Guwahati', state: 'Assam', rtoRate: 7 },
  { name: 'Dehradun', state: 'Uttarakhand', rtoRate: 8 },
  { name: 'Ranchi', state: 'Jharkhand', rtoRate: 9 },
  { name: 'Jamshedpur', state: 'Jharkhand', rtoRate: 9 },
  { name: 'Raipur', state: 'Chhattisgarh', rtoRate: 8 },
  { name: 'Amritsar', state: 'Punjab', rtoRate: 9 },
  { name: 'Ludhiana', state: 'Punjab', rtoRate: 9 },
  { name: 'Jodhpur', state: 'Rajasthan', rtoRate: 9 },
  { name: 'Udaipur', state: 'Rajasthan', rtoRate: 9 },
  { name: 'Kanpur', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Varanasi', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Agra', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Meerut', state: 'Uttar Pradesh', rtoRate: 8 },
  { name: 'Goa (Panaji)', state: 'Goa', rtoRate: 9 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', rtoRate: 9 },
  { name: 'Jammu', state: 'Jammu & Kashmir', rtoRate: 9 },
];

/** Calculate estimated on-road price for a bike in a given city */
export function estimateOnRoadPrice(exShowroomPrice: number | null | undefined, fuelType: 'petrol' | 'electric' | 'cng', cityName: string): number | null {
  if (exShowroomPrice == null || exShowroomPrice <= 0) return null;
  const match = ALL_CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) ?? POPULAR_CITIES[0];
  
  if (fuelType === 'electric') {
    // 0% RTO road tax for EVs in top states, 5% insurance + ₹1,500 registration
    const ins = Math.round(exShowroomPrice * 0.05);
    const reg = 1500;
    return exShowroomPrice + ins + reg;
  }

  // Petrol / CNG: State RTO road tax + 5% insurance + ₹2,500 registration & HSRP
  const rtoTax = Math.round((exShowroomPrice * match.rtoRate) / 100);
  const ins = Math.round(exShowroomPrice * 0.05) + 1000;
  const reg = 2500;
  return exShowroomPrice + rtoTax + ins + reg;
}

/** Standard 3-year EMI estimate with 15% down payment and 10% annual interest */
export function estimateEmi(exShowroomPrice: number | null | undefined): number | null {
  if (!exShowroomPrice || exShowroomPrice <= 0) return null;
  const loan = exShowroomPrice * 0.85;
  const r = 0.10 / 12;
  const n = 36;
  return Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

type CityContextType = {
  city: string;
  state: string;
  rtoRate: number;
  setCityByName: (name: string) => void;
  isModalOpen: boolean;
  openCityModal: () => void;
  closeCityModal: () => void;
};

const CityContext = createContext<CityContextType>({
  city: 'Delhi',
  state: 'Delhi',
  rtoRate: 8,
  setCityByName: () => {},
  isModalOpen: false,
  openCityModal: () => {},
  closeCityModal: () => {},
});

const STORAGE_KEY = 'bikechala_selected_city';

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<string>('Delhi');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ALL_CITIES.some((c) => c.name === saved)) {
        setCity(saved);
      }
    } catch {}
  }, []);

  const activeCityObj = useMemo(() => {
    return ALL_CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase()) ?? POPULAR_CITIES[0];
  }, [city]);

  const setCityByName = (name: string) => {
    const found = ALL_CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setCity(found.name);
      try {
        localStorage.setItem(STORAGE_KEY, found.name);
        document.cookie = `bikechala_city=${encodeURIComponent(found.name)}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
    }
    setIsModalOpen(false);
  };

  const openCityModal = () => setIsModalOpen(true);
  const closeCityModal = () => setIsModalOpen(false);

  return (
    <CityContext.Provider
      value={{
        city: activeCityObj.name,
        state: activeCityObj.state,
        rtoRate: activeCityObj.rtoRate,
        setCityByName,
        isModalOpen,
        openCityModal,
        closeCityModal,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
