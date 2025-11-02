export type WeatherCondition =
  | 'Sunny'
  | 'Clear'
  | 'PartlyCloudy'
  | 'Cloudy'
  | 'Rain'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist';

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number; // in Celsius
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  dewPoint: number;
  isDay: boolean; // true for day, false for night
}

export interface HourlyForecast {
  time: string; // e.g., "14:00"
  temperature: number; // in Celsius
  condition: WeatherCondition;
  precipitation: number; // % chance
}

export interface DailyForecast {
  date: string; // "YYYY-MM-DD"
  day: string; // "Friday"
  maxTemp: number; // in Celsius
  minTemp: number; // in Celsius
  condition: WeatherCondition;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface City {
  name: string;
  country: string;
}
