
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeatherData } from '@/api/weatherApi';
import type { WeatherData } from '@/lib/types';

interface WeatherState {
    data: Record<string, WeatherData>;
    loading: Record<string, 'idle' | 'pending' | 'failed'>;
}

const initialState: WeatherState = {
    data: {},
    loading: {},
};

export const fetchWeatherForCity = createAsyncThunk(
    'weather/fetchByCity',
    async (city: string, { rejectWithValue }) => {
        try {
            const data = await getWeatherData(city);
            return { city, data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeatherForCity.pending, (state, action) => {
                state.loading[action.meta.arg] = 'pending';
            })
            .addCase(fetchWeatherForCity.fulfilled, (state, action) => {
                state.loading[action.payload.city] = 'idle';
                state.data[action.payload.city] = action.payload.data;
            })
            .addCase(fetchWeatherForCity.rejected, (state, action) => {
                state.loading[action.meta.arg] = 'failed';
            });
    },
});

export default weatherSlice.reducer;
    