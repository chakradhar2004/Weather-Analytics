'use client';

import type { DailyForecast as DailyForecastType } from '@/lib/types';
import WeatherIcon from './weather-icon';
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature } from '@/lib/utils';
import { Separator } from './ui/separator';

interface DailyForecastProps {
  dailyData: DailyForecastType[];
}

const DailyForecast = ({ dailyData }: DailyForecastProps) => {
  const { unit } = useSettings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Show today + next 4 days
  const forecastToShow = dailyData.filter(d => new Date(d.date) >= today).slice(0, 5);

  return (
    <div className="space-y-4">
      {forecastToShow.map((day, index) => (
        <div key={day.date}>
          <div className="flex items-center justify-between py-2">
            <span className="w-1/3 font-medium">
              {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
            <div className="w-1/3 flex justify-center">
              <WeatherIcon condition={day.condition} iconUrl={day.conditionIcon} className="h-6 w-6 text-muted-foreground" width={24} height={24} />
            </div>
            <div className="w-1/3 text-right">
              <span className="font-medium">{convertTemperature(day.maxTemp, unit)}°</span>
              <span className="text-muted-foreground ml-2">{convertTemperature(day.minTemp, unit)}°</span>
            </div>
          </div>
          {index < forecastToShow.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default DailyForecast;
