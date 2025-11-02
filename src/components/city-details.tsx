'use client';

import type { WeatherData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherIcon from './weather-icon';
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature } from '@/lib/utils';
import HourlyForecastChart from './hourly-forecast-chart';
import DailyForecast from './daily-forecast';
import DetailedStatsGrid from './detailed-stats-grid';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CityDetailsProps {
  weatherData: WeatherData;
}

const CityDetails = ({ weatherData }: CityDetailsProps) => {
  const { unit } = useSettings();
  const { current, hourly, daily } = weatherData;

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const currentCity = current.city;
  const isFav = isFavorite(currentCity);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(currentCity);
      toast({
        title: `${currentCity} removed from favorites.`,
      });
    } else {
      addFavorite(currentCity);
      toast({
        title: `${currentCity} added to favorites!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-card-foreground">{current.city}</CardTitle>
              <p className="text-lg text-muted-foreground">{current.country}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 shrink-0"
              onClick={handleFavoriteToggle}
            >
              <Star className={cn('h-6 w-6', isFav ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div className="flex items-end gap-4">
            <WeatherIcon condition={current.condition} isNight={!current.isDay} className="h-20 w-20 text-foreground -mb-2" />
            <div className="text-8xl font-bold">
              {convertTemperature(current.temperature, unit)}°
            </div>
            <div className="text-lg text-muted-foreground mb-3">
              <p className="font-semibold">{unit === 'C' ? 'Celsius' : 'Fahrenheit'}</p>
              <p className="capitalize">{current.condition.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
          </div>
          <DetailedStatsGrid current={current} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyForecastChart hourlyData={hourly} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyForecast dailyData={daily} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CityDetails;
