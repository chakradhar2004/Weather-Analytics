import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from '../features/cities/citiesSlice';
import weatherReducer from '../features/weather/weatherSlice';
import { getSdks, initializeFirebase } from '@/firebase';

// Dummy auth slice for now
const authReducer = (state = { user: null }, action: any) => {
  switch (action.type) {
    case 'auth/setUser':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

let firebaseServices: ReturnType<typeof getSdks> | null = null;

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    weather: weatherReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          getFirestore: () => {
            if (typeof window === 'undefined') return null;
            if (!firebaseServices) {
                firebaseServices = initializeFirebase();
            }
            return firebaseServices.firestore;
          },
        },
      },
      serializableCheck: false, // Required for Firebase timestamps etc.
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
