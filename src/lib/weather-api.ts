import type { WeatherData, City, WeatherCondition, DailyForecast, HourlyForecast, CurrentWeather } from './types';

const API_BASE_URL = 'https://api.weatherapi.com/v1';

const getApiKey = (): string => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('Weather API key is not configured. Please add WEATHER_API_KEY to your .env.local file.');
  }
  return apiKey;
};

const mapCondition = (conditionText: string): WeatherCondition => {
  const text = conditionText.trim();
  // This is a simplified mapping. A more robust solution might use a map or more complex logic.
  // The goal is to fit the API response into our existing WeatherCondition type.
  switch (text) {
    case "Partly cloudy":
      return "Partly cloudy";
    case "Moderate rain":
      return "Moderate rain";
    case "Heavy rain":
      return "Heavy rain";
    case "Light rain":
      return "Light rain";
    case "Light rain shower":
        return "Light rain shower";
    default:
      return text as WeatherCondition;
  }
};


// Function to calculate Dew Point
const calculateDewPoint = (tempC: number, humidity: number): number => {
    // Magnus formula approximation
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return parseFloat(dewPoint.toFixed(1));
};


export const getWeatherData = async (city: string): Promise<WeatherData | null> => {
  try {
    const apiKey = getApiKey();
    const url = `${API_BASE_URL}/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching weather data: ${response.statusText}`);
      return null;
    }
    const data = await response.json();

    const current: CurrentWeather = {
      city: data.location.name,
      country: data.location.country,
      temperature: data.current.temp_c,
      condition: mapCondition(data.current.condition.text),
      conditionIcon: data.current.condition.icon,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      pressure: data.current.pressure_mb,
      uvIndex: data.current.uv,
      isDay: data.current.is_day === 1,
      dewPoint: calculateDewPoint(data.current.temp_c, data.current.humidity)
    };

    const hourly: HourlyForecast[] = data.forecast.forecastday[0].hour.map((h: any) => ({
      time: new Date(h.time_epoch * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature: h.temp_c,
      condition: mapCondition(h.condition.text),
      conditionIcon: h.condition.icon,
      precipitation: h.precip_mm,
    }));

    const daily: DailyForecast[] = data.forecast.forecastday.map((d: any) => ({
      date: d.date,
      day: new Date(d.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
      maxTemp: d.day.maxtemp_c,
      minTemp: d.day.mintemp_c,
      condition: mapCondition(d.day.condition.text),
      conditionIcon: d.day.condition.icon,
    }));

    return { current, hourly, daily };

  } catch (error) {
    console.error('Failed to get weather data:', error);
    if (error instanceof Error && error.message.includes('API key')) {
        // Re-throw the configuration error to be handled by an error boundary
        throw error;
    }
    return null;
  }
};

export const searchCities = async (query: string): Promise<City[]> => {
    if (query.length < 2) return [];
    try {
        const apiKey = getApiKey();
        const url = `${API_BASE_URL}/search.json?key=${apiKey}&q=${query}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error searching cities: ${response.statusText}`);
            return [];
        }
        
        const data = await response.json();
        
        return data.map((city: any) => ({
            name: city.name,
            country: city.country,
        }));

    } catch (error) {
        console.error('Failed to search cities:', error);
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        return [];
    }
};
