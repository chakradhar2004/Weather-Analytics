import { getWeatherData } from '@/lib/weather-api';
import CityDetails from '@/components/city-details';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CityPageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: CityPageProps) {
  const cityName = decodeURIComponent(params.name);
  return {
    title: `Weather in ${cityName} | WeatherWise`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const cityName = decodeURIComponent(params.name);
  const weatherData = await getWeatherData(cityName);

  if (!weatherData) {
    notFound();
  }
  
  const cityImageId = cityName.toLowerCase().replace(' ', '-');
  const cityImage = PlaceHolderImages.find(img => img.id === cityImageId);

  return (
    <div>
      {cityImage && (
        <div className="relative h-64 md:h-80 w-full">
            <Image
                src={cityImage.imageUrl}
                alt={cityImage.description}
                fill
                className="object-cover"
                data-ai-hint={cityImage.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className={cityImage ? "container mx-auto p-4 md:p-8 -mt-32 relative z-10" : "container mx-auto p-4 md:p-8"}>
        <CityDetails weatherData={weatherData} />
      </div>
    </div>
  );
}
