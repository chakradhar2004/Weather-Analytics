'use client';

import React from 'react';
import type { City, WeatherData } from '../lib/types';
import { useAppSelector } from '../hooks/redux-hooks';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Droplets, Wind, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { convertTemperature } from '../lib/utils';

interface CityCardProps {
  city: City;
  isFavorite: boolean;
  onFavClick: (city: City) => void;
  onCardClick: (city: City) => void;
}

export default function CityCard({ city, isFavorite, onFavClick, onCardClick }: CityCardProps) {
  const { data, loading } = useAppSelector((state) => ({
    data: state.weather.data[city.name],
    loading: state.weather.loading[city.name] === 'pending',
  }));
  const { unit } = useAppSelector((state) => state.cities);

  if (loading || !data) {
    return <Skeleton className="h-52 w-full" />;
  }

  const tempUnit = unit === 'metric' ? 'temp_c' : 'temp_f';
  const displayTemp = convertTemperature(data.current[tempUnit], unit);

  return (
    <Card
      className="relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
      onClick={() => onCardClick(city)}
    >
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onFavClick(city);
        }}
      >
        <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      </Button>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">{city.name}</CardTitle>
        <div className="text-4xl">
          <img src={`https:${data.current.condition.icon}`} alt={data.current.condition.text} width={48} height={48}/>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-bold">
          {displayTemp}°{unit === 'metric' ? 'C' : 'F'}
        </div>
        <p className="text-sm text-muted-foreground capitalize">{data.current.condition.text}</p>
        <div className="mt-4 flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Droplets className="mr-1 h-4 w-4" />
            <span>{data.current.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-1 h-4 w-4" />
            <span>{unit === 'metric' ? data.current.wind_kph : data.current.wind_mph} {unit === 'metric' ? 'km/h' : 'mph'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
