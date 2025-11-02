import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import type { WeatherCondition } from '@/lib/types';
import type { LucideProps } from 'lucide-react';
import Image from 'next/image';

interface WeatherIconProps extends Omit<LucideProps, 'condition'> {
  condition: WeatherCondition;
  isNight?: boolean;
  iconUrl?: string;
}

const conditionIconMap: { [key in WeatherCondition]?: React.ElementType } = {
  'Sunny': Sun,
  'Clear': Sun,
  'Partly cloudy': CloudSun,
  'Cloudy': Cloud,
  'Overcast': Cloud,
  'Mist': CloudFog,
  'Fog': CloudFog,
  'Freezing fog': CloudFog,
  'Patchy rain possible': CloudRain,
  'Patchy light drizzle': CloudDrizzle,
  'Light drizzle': CloudDrizzle,
  'Patchy light rain': CloudRain,
  'Light rain': CloudRain,
  'Moderate rain at times': CloudRain,
  'Moderate rain': CloudRain,
  'Heavy rain at times': CloudRain,
  'Heavy rain': CloudRain,
  'Light rain shower': CloudRain,
  'Moderate or heavy rain shower': CloudRain,
  'Torrential rain shower': CloudRain,
  'Patchy light rain with thunder': CloudLightning,
  'Moderate or heavy rain with thunder': CloudLightning,
  'Thundery outbreaks possible': CloudLightning,
  'Light freezing rain': Snowflake,
  'Moderate or heavy freezing rain': Snowflake,
  'Patchy snow possible': Snowflake,
  'Blowing snow': Snowflake,
  'Blizzard': Snowflake,
  'Patchy light snow': Snowflake,
  'Light snow': Snowflake,
  'Patchy moderate snow': Snowflake,
  'Moderate snow': Snowflake,
  'Patchy heavy snow': Snowflake,
  'Heavy snow': Snowflake,
  'Light snow showers': Snowflake,
  'Moderate or heavy snow showers': Snowflake,
};

const nightConditionIconMap: { [key in WeatherCondition]?: React.ElementType } = {
  ...conditionIconMap,
  'Sunny': Moon,
  'Clear': Moon,
  'Partly cloudy': CloudMoon,
};

const WeatherIcon = ({ condition, isNight = false, iconUrl, ...props }: WeatherIconProps) => {
  if (iconUrl) {
    return <Image src={`https:${iconUrl}`} alt={condition} width={props.width as number || 24} height={props.height as number || 24} className={props.className} />;
  }

  const Icon = isNight ? nightConditionIconMap[condition] : conditionIconMap[condition];

  if (!Icon) {
    return <Sun {...props} />; // Default icon
  }

  return <Icon {...props} />;
};

export default WeatherIcon;
