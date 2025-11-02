"use client";

import { createContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

export type TemperatureUnit = 'C' | 'F';

interface SettingsContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [unit, setUnitState] = useState<TemperatureUnit>('C');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedUnit = localStorage.getItem('weatherwise-unit') as TemperatureUnit;
      if (storedUnit && ['C', 'F'].includes(storedUnit)) {
        setUnitState(storedUnit);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
  }, []);

  const setUnit = (newUnit: TemperatureUnit) => {
    if (isMounted) {
      try {
        localStorage.setItem('weatherwise-unit', newUnit);
      } catch (error) {
        console.error("Could not access localStorage", error);
      }
      setUnitState(newUnit);
    }
  };
  
  const value = useMemo(() => ({
    unit,
    setUnit
  }), [unit, isMounted]);

  if (!isMounted) {
    // Prevent hydration mismatch by rendering nothing on the server.
    return null;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
