'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite, saveFavoritesToFirestore } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityDetail from '@/components/CityDetail';
import type { City } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useUser } from '@/firebase';

interface ClientPageProps {
  cityName: string;
}

export default function ClientPage({ cityName }: ClientPageProps) {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const weatherData = useAppSelector(state => state.weather.data[cityName]);
  const weatherStatus = useAppSelector(state => state.weather.loading[cityName]);
  const { favorites } = useAppSelector((state) => state.cities);

  useEffect(() => {
    // Fetch weather data if it's not already loading or present
    if (!weatherData && weatherStatus !== 'pending') {
      dispatch(fetchWeatherForCity(cityName));
    }
  }, [dispatch, cityName, weatherData, weatherStatus]);

  // Derive city and favorite status from weather data and favorites list
  const city: City | undefined = weatherData ? {
    id: weatherData.location.lon * 100 + weatherData.location.lat * 100, // Create a somewhat unique ID
    name: weatherData.location.name,
    country: weatherData.location.country,
  } : undefined;

  const isFavorite = city ? favorites.some(fav => fav.name === city.name) : false;

  const handleToggleFavorite = (cityToToggle: City) => {
    if (isFavorite) {
      const favCity = favorites.find(f => f.name === cityToToggle.name);
      if (favCity) {
        dispatch(removeFavorite(favCity.id));
      }
    } else {
      dispatch(addFavorite(cityToToggle));
    }
    if (user) {
        // @ts-ignore
        dispatch(saveFavoritesToFirestore());
    }
  };

  if (weatherStatus === 'failed') {
      notFound();
  }

  // Show a loading state or skeleton while data is being fetched
  if (weatherStatus === 'pending' || !city) {
    return <CityDetail city={null} isFavorite={false} onFavClick={() => {}} />;
  }

  return (
    <CityDetail 
        city={city}
        isFavorite={isFavorite}
        onFavClick={handleToggleFavorite}
    />
  );
}
