export type WeatherCondition =
  | 'Sunny'
  | 'Clear'
  | 'Partly cloudy'
  | 'Cloudy'
  | 'Overcast'
  | 'Mist'
  | 'Patchy rain possible'
  | 'Patchy snow possible'
  | 'Patchy sleet possible'
  | 'Patchy freezing drizzle possible'
  | 'Thundery outbreaks possible'
  | 'Blowing snow'
  | 'Blizzard'
  | 'Fog'
  | 'Freezing fog'
  | 'Patchy light drizzle'
  | 'Light drizzle'
  | 'Freezing drizzle'
  | 'Heavy freezing drizzle'
  | 'Patchy light rain'
  | 'Light rain'
  | 'Moderate rain at times'
  | 'Moderate rain'
  | 'Heavy rain at times'
  | 'Heavy rain'
  | 'Light freezing rain'
  | 'Moderate or heavy freezing rain'
  | 'Light sleet'
  | 'Moderate or heavy sleet'
  | 'Patchy light snow'
  | 'Light snow'
  | 'Patchy moderate snow'
  | 'Moderate snow'
  | 'Patchy heavy snow'
  | 'Heavy snow'
  | 'Ice pellets'
  | 'Light rain shower'
  | 'Moderate or heavy rain shower'
  | 'Torrential rain shower'
  | 'Light sleet showers'
  | 'Moderate or heavy sleet showers'
  | 'Light snow showers'
  | 'Moderate or heavy snow showers'
  | 'Light showers of ice pellets'
  | 'Moderate or heavy showers of ice pellets'
  | 'Patchy light rain with thunder'
  | 'Moderate or heavy rain with thunder'
  | 'Patchy light snow with thunder'
  | 'Moderate or heavy snow with thunder';

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number; // in Celsius
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number; // kph
  pressure: number; // millibars
  uvIndex: number;
  dewPoint: number; // in Celsius, will be calculated
  isDay: boolean; // true for day, false for night
  conditionIcon: string;
}

export interface HourlyForecast {
  time: string; // "HH:00"
  temperature: number; // in Celsius
  condition: WeatherCondition;
  precipitation: number; // mm
  conditionIcon: string;
}

export interface DailyForecast {
  date: string; // "YYYY-MM-DD"
  day: string; // "Friday"
  maxTemp: number; // in Celsius
  minTemp: number; // in Celsius
  condition: WeatherCondition;
  conditionIcon: string;
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
