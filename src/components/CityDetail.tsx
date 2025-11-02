'use client';

import React from 'react';
import { useAppSelector } from '@/hooks/redux-hooks';
import type { City } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Star, Droplets, Wind, Gauge, Sun } from 'lucide-react';
import { convertTemperature } from '@/lib/utils';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';

interface CityDetailProps {
  city: City | null;
  isFavorite: boolean;
  onFavClick: (city: City) => void;
}

const ChartTooltipContent = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded-lg shadow-lg">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Temp: ${payload[0].value}°${unit === 'metric' ? 'C' : 'F'}`}</p>
        </div>
      );
    }
  
    return null;
};

export default function CityDetail({ city, isFavorite, onFavClick }: CityDetailProps) {
  const cityName = city?.name;
  const { data, loading } = useAppSelector((state) => ({
    data: cityName ? state.weather.data[cityName] : null,
    loading: cityName ? state.weather.loading[cityName] === 'pending' : true,
  }));

  const { unit } = useAppSelector((state) => state.cities);
  const { resolvedTheme } = useTheme();

  if (loading || !data || !city) {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
    );
  }

  const tempUnit = unit === 'metric' ? 'temp_c' : 'temp_f';
  const displayTemp = convertTemperature(data.current[tempUnit], unit);
  const dewPoint = convertTemperature(data.current[unit === 'metric' ? 'dewpoint_c' : 'dewpoint_f'], unit);
  const windUnit = unit === 'metric' ? 'wind_kph' : 'wind_mph';
  const windUnitLabel = unit === 'metric' ? 'km/h' : 'mph';

  const hourlyData = data.forecast.forecastday[0].hour.map(h => ({
      time: format(new Date(h.time), 'ha'),
      temp: convertTemperature(h[tempUnit], unit),
  }));

  const dailyData = data.forecast.forecastday;

  return (
    <div className="space-y-6 container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{data.location.name}</CardTitle>
              <p className="text-lg text-muted-foreground">{data.location.country}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 shrink-0"
              onClick={() => onFavClick(city)}
            >
              <Star className={`h-6 w-6 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div className="flex items-end gap-4">
            <Image src={`https:${data.current.condition.icon}`} alt={data.current.condition.text} width={80} height={80} className="-mb-2" />
            <div className="text-8xl font-bold">{displayTemp}°</div>
            <div className="text-lg text-muted-foreground mb-3">
              <p className="font-semibold">{unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</p>
              <p className="capitalize">{data.current.condition.text}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
            <div className="flex flex-col items-start"><div className="text-sm text-muted-foreground flex items-center gap-1.5"><Droplets className="h-4 w-4" />Humidity</div><div className="text-2xl font-semibold">{data.current.humidity}%</div></div>
            <div className="flex flex-col items-start"><div className="text-sm text-muted-foreground flex items-center gap-1.5"><Wind className="h-4 w-4" />Wind</div><div className="text-2xl font-semibold">{data.current[windUnit]} {windUnitLabel}</div></div>
            <div className="flex flex-col items-start"><div className="text-sm text-muted-foreground flex items-center gap-1.5"><Gauge className="h-4 w-4" />Pressure</div><div className="text-2xl font-semibold">{data.current.pressure_mb} hPa</div></div>
            <div className="flex flex-col items-start"><div className="text-sm text-muted-foreground flex items-center gap-1.5"><Sun className="h-4 w-4" />UV Index</div><div className="text-2xl font-semibold">{data.current.uv}</div></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Hourly Forecast</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent unit={unit} />} />
                    <Line type="monotone" dataKey="temp" stroke={resolvedTheme === 'dark' ? '#8884d8' : '#2563eb'} dot={false} />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>5-Day Forecast</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {dailyData.map(day => (
                 <div key={day.date} className="flex items-center justify-between py-1">
                    <span className="w-1/3 font-medium">{format(new Date(day.date), 'EEEE')}</span>
                    <div className="w-1/3 flex justify-center">
                        <Image src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} width={24} height={24} />
                    </div>
                    <div className="w-1/3 text-right">
                        <span className="font-medium">{convertTemperature(day.day[unit === 'metric' ? 'maxtemp_c' : 'maxtemp_f'], unit)}°</span>
                        <span className="text-muted-foreground ml-2">{convertTemperature(day.day[unit === 'metric' ? 'mintemp_c' : 'mintemp_f'], unit)}°</span>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
