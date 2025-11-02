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

  // Find the city from the favorites list in the Redux store
  const city = favorites.find(fav => fav.name === cityName);

  const isFavorite = !!city;

  const handleToggleFavorite = (cityToToggle: City) => {
    if (isFavorite) {
      dispatch(removeFavorite(cityToToggle.id));
    } else {
      // If the city isn't in favorites, we need a complete city object to add it.
      // This part might need more robust logic if we can land here with a non-favorite city.
      // For now, we assume the detail page is only for favorite cities.
      dispatch(addFavorite(cityToToggle));
    }
    if (user) {
        dispatch(saveFavoritesToFirestore());
    }
  };

  if (weatherStatus === 'failed') {
      notFound();
  }

  // A city object is required to render details.
  // Show loading/skeleton if weather data is fetching OR if the city isn't in our list yet.
  if (weatherStatus === 'pending' || !city) {
    // We pass a temporary city object to the skeleton to avoid errors, 
    // but the component will show its loading state.
    const tempCityForSkeleton: City = city || { id: 0, name: cityName, country: '' };
    return <CityDetail city={tempCityForSkeleton} isFavorite={false} onFavClick={() => {}} />;
  }

  return (
    <CityDetail 
        city={city}
        isFavorite={isFavorite}
        onFavClick={handleToggleFavorite}
    />
  );
}
