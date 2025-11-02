
'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityDetail from '@/components/CityDetail';
import type { City } from '@/lib/types';
import { notFound } from 'next/navigation';

interface CityPageProps {
  params: {
    name: string;
  };
}

export default function CityPage({ params }: CityPageProps) {
  const dispatch = useAppDispatch();
  const cityName = decodeURIComponent(params.name);
  const { favorites } = useAppSelector((state) => state.cities);
  
  // Local state to hold city object, as it's not in the store initially
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    dispatch(fetchWeatherForCity(cityName));
    // We create a temporary city object for the detail view.
    // A more robust solution might fetch city details from an endpoint if needed.
    const tempCityObject = {
        id: Date.now(), // Temporary ID
        name: cityName,
        country: '', // Country is not available from URL param alone
    };
    setCity(tempCityObject);

  }, [dispatch, cityName]);

  const isFavorite = city ? favorites.some(fav => fav.name === city.name) : false;

  const handleToggleFavorite = (cityToToggle: City) => {
    if (isFavorite) {
      const favCity = favorites.find(f => f.name === cityToToggle.name);
      if (favCity) {
        dispatch(removeFavorite(favCity.id));
      }
    } else {
      // We may need more city details to add to favorites.
      // For now, we use what we have.
      dispatch(addFavorite(cityToToggle));
    }
  };

  const weatherData = useAppSelector(state => state.weather.data[cityName]);
  const isLoading = useAppSelector(state => state.weather.loading[cityName] === 'pending');

  if (!isLoading && !weatherData) {
      notFound();
  }

  if (!city) {
      return null; // or a loading state
  }
  
  return (
    <CityDetail 
        city={city}
        isFavorite={isFavorite}
        onFavClick={handleToggleFavorite}
    />
  );
}
    