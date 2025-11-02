'use server';

import { searchCities as searchCitiesFromApi } from '@/lib/weather-api';
import type { City } from '@/lib/types';

export async function searchCities(query: string): Promise<City[]> {
  if (!query) {
    return [];
  }
  try {
    const cities = await searchCitiesFromApi(query);
    return cities;
  } catch (error) {
    console.error('Failed to search cities:', error);
    return [];
  }
}
