
import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from '../features/cities/citiesSlice';
import weatherReducer from '../features/weather/weatherSlice';

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
    