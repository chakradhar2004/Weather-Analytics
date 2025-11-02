'use client';

import { Droplets, Wind, Gauge, Sun, Waves } from 'lucide-react';
import type { CurrentWeather } from '@/lib/types';
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature } from '@/lib/utils';

interface DetailedStatsGridProps {
  current: CurrentWeather;
}

const DetailedStatsGrid = ({ current }: DetailedStatsGridProps) => {
  const { unit } = useSettings();
  const stats = [
    { icon: Droplets, label: 'Humidity', value: `${current.humidity}%` },
    { icon: Wind, label: 'Wind Speed', value: `${current.windSpeed} km/h` },
    { icon: Gauge, label: 'Pressure', value: `${current.pressure} hPa` },
    { icon: Sun, label: 'UV Index', value: current.uvIndex },
    { icon: Waves, label: 'Dew Point', value: `${convertTemperature(current.dewPoint, unit)}°` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-start">
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <stat.icon className="h-4 w-4" />
            {stat.label}
          </div>
          <div className="text-2xl font-semibold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DetailedStatsGrid;
