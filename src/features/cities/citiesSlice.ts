import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { City } from '@/lib/types';
import { doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import type { RootState } from '@/app/store';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type State = {
  favorites: City[];
  unit: 'metric' | 'imperial';
  hydrated: boolean;
}

// Thunk to save favorites to Firestore
export const saveFavoritesToFirestore = createAsyncThunk(
  'cities/saveFavoritesToFirestore',
  async (_, { getState, extra }) => {
    const { getFirestore } = extra as { getFirestore: () => Firestore | null };
    const firestore = getFirestore();
    const state = getState() as RootState;
    const user = state.auth.user;
    const favorites = state.cities.favorites;

    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      setDoc(userDocRef, { favoriteCities: favorites }, { merge: true })
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'update',
              requestResourceData: { favoriteCities: favorites },
            })
          );
        });
    }
  }
);

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
  return [{ id: 1269843, name: 'Hyderabad', country: 'India' }];
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
  favorites: [],
  unit: 'metric',
  hydrated: false,
}

const slice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<City>) {
      const city = action.payload;
      if (!state.favorites.find(fav => fav.id === city.id)) {
        state.favorites.push(city);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fav_cities', JSON.stringify(state.favorites));
        }
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      const cityId = action.payload;
      state.favorites = state.favorites.filter(fav => fav.id !== cityId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fav_cities', JSON.stringify(state.favorites));
      }
    },
    setFavorites(state, action: PayloadAction<City[]>) {
        state.favorites = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('fav_cities', JSON.stringify(state.favorites));
        }
    },
    setUnit(state, action: PayloadAction<State['unit']>) {
      state.unit = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('unit', state.unit);
      }
    },
    hydrate(state) {
      state.favorites = getInitialFavorites();
      state.unit = getInitialUnit();
      state.hydrated = true;
    }
  },
});

export const { addFavorite, removeFavorite, setFavorites, setUnit, hydrate } = slice.actions;
export default slice.reducer;
