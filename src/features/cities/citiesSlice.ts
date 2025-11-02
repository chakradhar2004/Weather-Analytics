
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { City } from '@/lib/types';

type State = {
  favorites: City[];
  unit: 'metric' | 'imperial';
}

const getInitialFavorites = (): City[] => {
  if (typeof window === 'undefined') return [{ id: 1269843, name: 'Hyderabad', country: 'India' }];
  try {
    const stored = localStorage.getItem('fav_cities');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [{ id: 1269843, name: 'Hyderabad', country: 'India' }]; // Default
};


const getInitialUnit = (): 'metric' | 'imperial' => {
  if (typeof window === 'undefined') return 'metric';
  try {
    const storedUnit = localStorage.getItem('unit') as 'metric' | 'imperial';
    if (storedUnit === 'metric' || storedUnit === 'imperial') {
      return storedUnit;
    }
  } catch {}
  return 'metric';
};

const initialState: State = {
  favorites: getInitialFavorites(),
  unit: getInitialUnit(),
}

const slice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<City>) {
      const city = action.payload;
      if (!state.favorites.find(fav => fav.id === city.id)) {
        state.favorites.push(city);
        localStorage.setItem('fav_cities', JSON.stringify(state.favorites));
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      const cityId = action.payload;
      state.favorites = state.favorites.filter(fav => fav.id !== cityId);
      localStorage.setItem('fav_cities', JSON.stringify(state.favorites));
    },
    setUnit(state, action: PayloadAction<State['unit']>) {
      state.unit = action.payload;
      localStorage.setItem('unit', state.unit);
    }
  }
});

export const { addFavorite, removeFavorite, setUnit } = slice.actions;
export default slice.reducer;
    