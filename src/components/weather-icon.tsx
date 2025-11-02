import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import type { WeatherCondition } from '@/lib/types';
import type { LucideProps } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  condition: WeatherCondition;
  isNight?: boolean;
}

const iconMap: Record<WeatherCondition, React.ElementType> = {
  Sunny: Sun,
  Clear: Sun, // Use Sun for Clear during the day
  PartlyCloudy: CloudSun,
  Cloudy: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
  Mist: CloudFog,
};

const nightIconMap: Record<WeatherCondition, React.ElementType> = {
    ...iconMap,
    Sunny: Moon, // Sunny at night is just clear
    Clear: Moon,
    PartlyCloudy: CloudMoon,
};


const WeatherIcon = ({ condition, isNight = false, ...props }: WeatherIconProps) => {
  const Icon = isNight ? nightIconMap[condition] : iconMap[condition];

  if (!Icon) {
    return <Sun {...props} />; // Default icon
  }

  return <Icon {...props} />;
};

export default WeatherIcon;
