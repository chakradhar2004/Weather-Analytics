import type { WeatherData, City, WeatherCondition, DailyForecast, HourlyForecast } from './types';

// Helper to generate a range of numbers
const range = (size: number, startAt: number = 0): number[] => [...Array(size).keys()].map(i => i + startAt);

// Helper to get random item from array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const ALL_CITIES: City[] = [
  { name: 'Hyderabad', country: 'India' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Chennai', country: 'India' },
  { name: 'Kolkata', country: 'India' },
  { name: 'Pune', country: 'India' },
  { name: 'Jaipur', country: 'India' },
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
  'Hyderabad': {
    current: {
      city: 'Hyderabad',
      country: 'India',
      temperature: 32,
      condition: 'Sunny',
      humidity: 40,
      windSpeed: 10,
      pressure: 1010,
      uvIndex: 9,
      dewPoint: 18,
      isDay: true,
    },
    hourly: generateHourlyForecast(32),
    daily: generateDailyForecast(32),
  },
  'Mumbai': {
    current: {
      city: 'Mumbai',
      country: 'India',
      temperature: 29,
      condition: 'PartlyCloudy',
      humidity: 75,
      windSpeed: 15,
      pressure: 1008,
      uvIndex: 7,
      dewPoint: 24,
      isDay: true,
    },
    hourly: generateHourlyForecast(29),
    daily: generateDailyForecast(29),
  },
  'Delhi': {
    current: {
      city: 'Delhi',
      country: 'India',
      temperature: 35,
      condition: 'Mist',
      humidity: 30,
      windSpeed: 8,
      pressure: 1005,
      uvIndex: 10,
      dewPoint: 15,
      isDay: true,
    },
    hourly: generateHourlyForecast(35),
    daily: generateDailyForecast(35),
  },
  'Bangalore': {
    current: {
      city: 'Bangalore',
      country: 'India',
      temperature: 27,
      condition: 'Cloudy',
      humidity: 65,
      windSpeed: 12,
      pressure: 1012,
      uvIndex: 6,
      dewPoint: 20,
      isDay: true,
    },
    hourly: generateHourlyForecast(27),
    daily: generateDailyForecast(27),
  },
  'Chennai': {
    current: {
      city: 'Chennai',
      country: 'India',
      temperature: 31,
      condition: 'Rain',
      humidity: 80,
      windSpeed: 18,
      pressure: 1007,
      uvIndex: 8,
      dewPoint: 26,
      isDay: true,
    },
    hourly: generateHourlyForecast(31),
    daily: generateDailyForecast(31),
  },
    'Kolkata': {
    current: {
      city: 'Kolkata',
      country: 'India',
      temperature: 30,
      condition: 'PartlyCloudy',
      humidity: 85,
      windSpeed: 14,
      pressure: 1006,
      uvIndex: 7,
      dewPoint: 27,
      isDay: true,
    },
    hourly: generateHourlyForecast(30),
    daily: generateDailyForecast(30),
  },
  'Pune': {
    current: {
      city: 'Pune',
      country: 'India',
      temperature: 28,
      condition: 'Cloudy',
      humidity: 70,
      windSpeed: 16,
      pressure: 1009,
      uvIndex: 6,
      dewPoint: 22,
      isDay: true,
    },
    hourly: generateHourlyForecast(28),
    daily: generateDailyForecast(28),
  },
  'Jaipur': {
    current: {
      city: 'Jaipur',
      country: 'India',
      temperature: 36,
      condition: 'Sunny',
      humidity: 25,
      windSpeed: 12,
      pressure: 1004,
      uvIndex: 11,
      dewPoint: 14,
      isDay: true,
    },
    hourly: generateHourlyForecast(36),
    daily: generateDailyForecast(36),
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
                current: { ...fallbackCity.current, city: city, isDay: true, country: 'India' }
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
