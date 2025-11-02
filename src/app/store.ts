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


const firebaseServices = typeof window !== 'undefined' ? initializeFirebase() : getSdks(null as any);


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
          firestore: firebaseServices?.firestore,
        },
      },
      serializableCheck: false, // Required for Firebase timestamps etc.
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
