
'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityCard from '@/components/CityCard';
import CityDetail from '@/components/CityDetail';
import SearchBar from '@/components/SearchBar';
import type { City } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.cities);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    favorites.forEach((city) => {
      dispatch(fetchWeatherForCity(city.name));
    });

    const interval = setInterval(() => {
        favorites.forEach((city) => {
            dispatch(fetchWeatherForCity(city.name));
          });
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [favorites, dispatch]);

  const handleSelectCity = (city: City) => {
    dispatch(addFavorite(city));
    dispatch(fetchWeatherForCity(city.name));
  };
  
  const handleToggleFavorite = (city: City) => {
    const isFav = favorites.some(fav => fav.id === city.id);
    if (isFav) {
      dispatch(removeFavorite(city.id));
    } else {
      dispatch(addFavorite(city));
    }
  };

  const isCityFavorite = (cityId: number) => favorites.some(fav => fav.id === cityId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Cities</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorite Cities</h2>
          <p className="text-muted-foreground mb-4 max-w-sm">
            You haven't added any cities to your dashboard. Use the search bar to find and add cities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isFavorite={true}
              onFavClick={handleToggleFavorite}
              onCardClick={() => setSelectedCity(city)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedCity} onOpenChange={(isOpen) => !isOpen && setSelectedCity(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            {selectedCity && (
                <CityDetail 
                    city={selectedCity} 
                    isFavorite={isCityFavorite(selectedCity.id)}
                    onFavClick={handleToggleFavorite}
                />
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
    