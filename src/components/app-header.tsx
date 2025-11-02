
'use client';
import Link from 'next/link';
import { CloudSun } from 'lucide-react';
import SearchBar from './SearchBar'; // Corrected import
import { useAppDispatch } from '@/hooks/redux-hooks';
import { addFavorite } from '@/features/cities/citiesSlice';
import type { City } from '@/lib/types';
import UnitToggle from './unit-toggle';
import { useRouter } from 'next/navigation';


const AppHeader = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const handleCitySelect = (city: City) => {
    dispatch(addFavorite(city));
    router.push(`/city/${encodeURIComponent(city.name)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CloudSun className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            WeatherWise
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
          <nav className="flex items-center space-x-2">
            <UnitToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
    