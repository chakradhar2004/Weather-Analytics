# **App Name**: WeatherWise Dashboard

## Core Features:

- Dashboard Summary: Display summary cards for multiple cities with current temperature, weather condition icon, humidity, and wind speed. Supports real-time updates every 60 seconds.
- Detailed City View: Dedicated page with 5-7 day forecast, hourly forecast, and detailed stats (pressure, dew point, UV index).
- Search and Favorites: Search bar to look up cities using API-based autocomplete. Users can 'favorite' cities to pin them to the dashboard, persisting between sessions.
- Data Visualization: Charts to show temperature trends (hourly & daily), precipitation patterns, and wind speed/direction. Interactive elements like hover effects and date range selectors.
- Settings Panel: Allow users to switch between Celsius and Fahrenheit.
- Google Sign-In: Allow users to save and persist favorite city data.
- Data Caching: Cache API responses to reduce API calls and improve performance, updating cached data every 60 seconds.

## Style Guidelines:

- Primary color: A calm blue (#4A8FE7) to evoke a sense of trust and reliability, reflecting the informational nature of weather data.
- Background color: Light gray (#F0F4F8), providing a neutral backdrop that ensures readability and reduces eye strain.
- Accent color: A muted green (#70C77F) for highlighting interactive elements and calls to action, suggesting growth and favorable conditions.
- Body and headline font: 'Inter', a sans-serif font that gives a modern, machined and objective look
- Use clear, minimalist icons to represent weather conditions (sunny, cloudy, rainy, etc.). Icons should be consistent and easily recognizable.
- Dashboard should use a responsive grid layout. City cards are uniformly sized, but adjust and re-arrange for different screen sizes. The detailed view should have a clear hierarchy with data visualizations presented logically.
- Subtle transitions when updating weather data or switching between views to provide a smooth user experience. Use animations to highlight new or updated data.