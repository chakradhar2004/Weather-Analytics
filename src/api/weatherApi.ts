
const API_BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = '18221e14eace24caeb5baa57cfe55b63'; 

const CACHE_KEY_PREFIX = 'weather_cache_v1_';
const TTL_MS = 60 * 1000; // 60s

function cacheKey(url: string) { return `${CACHE_KEY_PREFIX}${url}`; }

export async function fetchWithCache(url: string, force = false) {
  const key = cacheKey(url);
  
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(key);
    if (!force && raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < TTL_MS) {
          return parsed.data;
        }
      } catch {}
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }
  const data = await response.json();
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }
  
  return data;
}

export const searchCities = (query: string) => {
    if (query.length < 2) return Promise.resolve([]);
    const url = `${API_BASE_URL}/search.json?key=${API_KEY}&q=${query}`;
    return fetchWithCache(url);
};

export const getWeatherData = (city: string, days = 5) => {
    const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
    return fetchWithCache(url);
};
    