'use client';
import { Link } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import SearchBar from './SearchBar'; // Corrected import
import { useAppDispatch } from '../hooks/redux-hooks';
import { addFavorite, saveFavoritesToFirestore } from '../features/cities/citiesSlice';
import type { City } from '../lib/types';
import UnitToggle from './unit-toggle';
import { useNavigate } from 'react-router-dom';
import { fetchWeatherForCity } from '../features/weather/weatherSlice';
import AuthButton from './auth-button';


const AppHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleCitySelect = (city: City) => {
    dispatch(addFavorite(city));
    dispatch(fetchWeatherForCity(city.name));
    dispatch(saveFavoritesToFirestore());
    // The line below was causing the immediate redirect. It has been removed.
    // router.push(`/city/${encodeURIComponent(city.name)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container flex h-16 items-center justify-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2">
              <CloudSun className="h-6 w-6 text-white" />
            </div>
            <span className="hidden font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:inline-block">
              Weather Analytics
            </span>
          </Link>
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-md">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
          <div className="flex items-center space-x-3">
            <UnitToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
