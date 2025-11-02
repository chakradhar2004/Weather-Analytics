'use client';

import { useEffect, useState, useCallback } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { getWeatherData } from '@/lib/weather-api';
import type { WeatherData } from '@/lib/types';
import CityCard from './city-card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

const DashboardClient = () => {
  const { favorites, isMounted } = useFavorites();
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isMounted || favorites.length === 0) {
      if(isMounted) setLoading(false);
      return;
    }

    setLoading(true);
    const dataPromises = favorites.map(city => getWeatherData(city).catch(() => null));
    const results = await Promise.all(dataPromises);

    const newWeatherData: Record<string, WeatherData | null> = {};
    favorites.forEach((city, index) => {
      newWeatherData[city] = results[index];
    });

    setWeatherData(newWeatherData);
    setLoading(false);
  }, [favorites, isMounted]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (!isMounted) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
        </div>
    );
  }

  if (loading) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: favorites.length || 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
        </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Favorite Cities</h2>
        <p className="text-muted-foreground mb-4 max-w-sm">
          You haven't added any cities to your dashboard. Use the search bar to find and add cities.
        </p>
        <Button variant="outline" onClick={() => document.querySelector<HTMLInputElement>('input[cmdk-input]')?.focus()}>
          Search for a city
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {favorites.map(city => {
        const data = weatherData[city];
        if (!data) return <Skeleton key={city} className="h-48 rounded-lg" />;
        return <CityCard key={city} data={data} />;
      })}
    </div>
  );
};

export default DashboardClient;
