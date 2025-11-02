import type { WeatherData, City, WeatherCondition, DailyForecast, HourlyForecast } from './types';

// Helper to generate a range of numbers
const range = (size: number, startAt: number = 0): number[] => [...Array(size).keys()].map(i => i + startAt);

// Helper to get random item from array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const ALL_CITIES: City[] = [
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Paris', country: 'France' },
  { name: 'Cairo', country: 'Egypt' },
  { name: 'Los Angeles', country: 'USA' },
  { name: 'Berlin', country: 'Germany' },
];

const WEATHER_CONDITIONS: WeatherCondition[] = ['Sunny', 'PartlyCloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Snow', 'Mist', 'Clear'];

const generateHourlyForecast = (baseTemp: number): HourlyForecast[] => {
  const now = new Date();
  return range(48).map(i => {
    const hour = (now.getHours() + i) % 24;
    const tempFluctuation = Math.sin((i - 6) * (Math.PI / 12)) * 5; // Sine wave for daily temp change
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      temperature: baseTemp + tempFluctuation + randomInt(-1, 1),
      condition: randomItem(WEATHER_CONDITIONS),
      precipitation: randomItem([0, 0, 0, 10, 20, 50]),
    };
  });
};

const generateDailyForecast = (baseTemp: number): DailyForecast[] => {
  const today = new Date();
  return range(7).map(i => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const maxTemp = baseTemp + 5 + randomInt(-2, 2);
    const minTemp = baseTemp - 2 + randomInt(-2, 2);
    return {
      date: date.toISOString().split('T')[0],
      day: dayOfWeek,
      maxTemp,
      minTemp,
      condition: randomItem(WEATHER_CONDITIONS),
    };
  });
};

const MOCK_WEATHER_DATA: Record<string, WeatherData> = {
  'New York': {
    current: {
      city: 'New York',
      country: 'USA',
      temperature: 18,
      condition: 'PartlyCloudy',
      humidity: 60,
      windSpeed: 15,
      pressure: 1012,
      uvIndex: 5,
      dewPoint: 10,
      isDay: true,
    },
    hourly: generateHourlyForecast(18),
    daily: generateDailyForecast(18),
  },
  'London': {
    current: {
      city: 'London',
      country: 'UK',
      temperature: 14,
      condition: 'PartlyCloudy',
      humidity: 75,
      windSpeed: 20,
      pressure: 1008,
      uvIndex: 0,
      dewPoint: 9,
      isDay: false,
    },
    hourly: generateHourlyForecast(14),
    daily: generateDailyForecast(14),
  },
  'Tokyo': {
    current: {
      city: 'Tokyo',
      country: 'Japan',
      temperature: 22,
      condition: 'Sunny',
      humidity: 50,
      windSpeed: 10,
      pressure: 1015,
      uvIndex: 7,
      dewPoint: 12,
      isDay: true,
    },
    hourly: generateHourlyForecast(22),
    daily: generateDailyForecast(22),
  },
  'Sydney': {
    current: {
      city: 'Sydney',
      country: 'Australia',
      temperature: 25,
      condition: 'Sunny',
      humidity: 45,
      windSpeed: 25,
      pressure: 1018,
      uvIndex: 9,
      dewPoint: 13,
      isDay: true,
    },
    hourly: generateHourlyForecast(25),
    daily: generateDailyForecast(25),
  },
  'Paris': {
    current: {
      city: 'Paris',
      country: 'France',
      temperature: 17,
      condition: 'Rain',
      humidity: 80,
      windSpeed: 18,
      pressure: 1005,
      uvIndex: 3,
      dewPoint: 13,
      isDay: true,
    },
    hourly: generateHourlyForecast(17),
    daily: generateDailyForecast(17),
  },
  'Cairo': {
    current: {
      city: 'Cairo',
      country: 'Egypt',
      temperature: 30,
      condition: 'Sunny',
      humidity: 30,
      windSpeed: 8,
      pressure: 1010,
      uvIndex: 10,
      dewPoint: 11,
      isDay: true,
    },
    hourly: generateHourlyForecast(30),
    daily: generateDailyForecast(30),
  },
  'Los Angeles': {
    current: {
      city: 'Los Angeles',
      country: 'USA',
      temperature: 24,
      condition: 'Sunny',
      humidity: 40,
      windSpeed: 12,
      pressure: 1014,
      uvIndex: 8,
      dewPoint: 10,
      isDay: true,
    },
    hourly: generateHourlyForecast(24),
    daily: generateDailyForecast(24),
  },
  'Berlin': {
    current: {
      city: 'Berlin',
      country: 'Germany',
      temperature: 16,
      condition: 'Cloudy',
      humidity: 65,
      windSpeed: 14,
      pressure: 1009,
      uvIndex: 4,
      dewPoint: 9,
      isDay: true,
    },
    hourly: generateHourlyForecast(16),
    daily: generateDailyForecast(16),
  },
};

// Function to slightly randomize current data on each fetch
const randomizeCurrentData = (data: WeatherData): WeatherData => {
  const newTemp = data.current.temperature + (Math.random() - 0.5) * 0.5; // Fluctuate by +/- 0.25
  return {
    ...data,
    current: {
      ...data.current,
      temperature: parseFloat(newTemp.toFixed(1)),
      humidity: data.current.humidity + randomInt(-1, 1),
    }
  };
};

// Simulates an API call to get weather data for a specific city
export const getWeatherData = async (city: string): Promise<WeatherData | null> => {
  console.log(`Fetching weather data for ${city}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const cityData = MOCK_WEATHER_DATA[city];
      if (cityData) {
        resolve(randomizeCurrentData(cityData));
      } else {
        // Find a fallback city to return data for, if not found
        const fallbackCity = Object.values(MOCK_WEATHER_DATA)[0];
        if (fallbackCity) {
            const tempCityData: WeatherData = {
                ...fallbackCity,
                current: { ...fallbackCity.current, city: city, isDay: true }
            }
            resolve(randomizeCurrentData(tempCityData));
        } else {
            resolve(null);
        }
      }
    }, 500); // Simulate network delay
  });
};

// Simulates an API call to search for cities
export const searchCities = async (query: string): Promise<City[]> => {
  console.log(`Searching for city: ${query}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        return resolve([]);
      }
      const lowercasedQuery = query.toLowerCase();
      const results = ALL_CITIES.filter(city =>
        city.name.toLowerCase().includes(lowercasedQuery)
      );
      resolve(results);
    }, 300); // Simulate network delay
  });
};
