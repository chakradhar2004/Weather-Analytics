'use client';

import Link from 'next/link';
import type { WeatherData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WeatherIcon from './weather-icon';
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature } from '@/lib/utils';
import { Droplets, Wind, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CityCardProps {
  data: WeatherData;
}

const CityCard = ({ data }: CityCardProps) => {
  const { unit } = useSettings();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const currentCity = data.current.city;
  const isFav = isFavorite(currentCity);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(currentCity);
      toast({
        title: `${currentCity} removed from favorites.`,
        variant: 'default',
      });
    } else {
      addFavorite(currentCity);
      toast({
        title: `${currentCity} added to favorites!`,
        variant: 'default',
      });
    }
  };

  return (
    <Link href={`/city/${currentCity}`} className="block transition-transform duration-200 hover:scale-105">
      <Card className="relative overflow-hidden h-full flex flex-col justify-between">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 z-10"
          onClick={handleFavoriteToggle}
        >
          <Star className={cn('h-5 w-5', isFav ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
        </Button>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">{currentCity}</CardTitle>
          <div className="text-4xl">
            <WeatherIcon condition={data.current.condition} isNight={!data.current.isDay} iconUrl={data.current.conditionIcon} width={48} height={48} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold">
            {convertTemperature(data.current.temperature, unit)}°{unit}
          </div>
          <p className="text-sm text-muted-foreground capitalize">{data.current.condition}</p>
          <div className="mt-4 flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Droplets className="mr-1 h-4 w-4" />
              <span>{data.current.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="mr-1 h-4 w-4" />
              <span>{data.current.windSpeed} km/h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CityCard;
