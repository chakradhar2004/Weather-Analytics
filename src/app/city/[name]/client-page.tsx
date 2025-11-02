'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityDetail from '@/components/CityDetail';
import type { City } from '@/lib/types';
import { notFound } from 'next/navigation';

interface ClientPageProps {
  cityName: string;
}

export default function ClientPage({ cityName }: ClientPageProps) {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.cities);
  
  // Local state to hold city object, as it's not in the store initially
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    dispatch(fetchWeatherForCity(cityName));
    // We create a temporary city object for the detail view.
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
  const weatherStatus = useAppSelector(state => state.weather.loading[cityName]);

  if (weatherStatus === 'failed') {
      notFound();
  }

  // Show a loading state or skeleton while data is being fetched
  if (weatherStatus === 'pending' || !weatherData) {
    // Using the skeleton from CityDetail for consistency
    return <CityDetail city={null} isFavorite={false} onFavClick={() => {}} />;
  }
  
  // We can only be sure about the city object after weatherData is loaded.
  const finalCity: City = {
      id: city?.id || Date.now(),
      name: weatherData.location.name,
      country: weatherData.location.country,
  }
  
  return (
    <CityDetail 
        city={finalCity}
        isFavorite={isFavorite}
        onFavClick={handleToggleFavorite}
    />
  );
}
