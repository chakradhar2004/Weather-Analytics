
// A slimmed-down version for search results
export interface CitySearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    pressure_mb: number;
    uv: number;
    is_day: number;
    dewpoint_c: number;
    dewpoint_f: number;
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: {
        time: string;
        temp_c: number;
        temp_f: number;
        precip_mm: number;
        condition: {
          text: string;
          icon: string;
        };
      }[];
    }[];
  };
  location: {
    name: string;
    country: string;
  };
}

export interface City {
  id: number;
  name: string;
  country: string;
}
    