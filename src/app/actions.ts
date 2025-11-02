'use server';

import {
  searchCities as searchCitiesFromApi,
  getWeatherData as getWeatherDataFromApi,
} from '@/lib/weather-api';
import type { City, WeatherData } from '@/lib/types';

export async function searchCities(query: string): Promise<City[]> {
  if (!query) {
    return [];
  }
  try {
    const cities = await searchCitiesFromApi(query);
    return cities;
  } catch (error) {
    console.error('Failed to search cities:', error);
    // In a real app, you might want to re-throw or handle this error differently
    return [];
  }
}

export async function getWeatherData(
  city: string
): Promise<WeatherData | null> {
  try {
    const weatherData = await getWeatherDataFromApi(city);
    return weatherData;
  } catch (error) {
    console.error(`Failed to get weather data for ${city}:`, error);
    // In a real app, you might want to re-throw or handle this error differently
    return null;
  }
}
