# Weather Analytics Dashboard

A modern, responsive weather analytics dashboard built with Next.js, React, Redux Toolkit, and Firebase. This application allows users to search for cities, add them to their favorites, view detailed weather information, and sync data across devices using Firebase Firestore.

## Features

- **City Search**: Search for cities worldwide using the OpenWeatherMap API
- **Favorites Management**: Add/remove cities from your personal favorites list
- **Weather Details**: View comprehensive weather information including temperature, humidity, wind speed, and forecasts
- **User Authentication**: Sign in with Google to sync your favorites across devices
- **Real-time Sync**: Automatic synchronization of favorites using Firebase Firestore
- **Responsive Design**: Optimized for desktop and mobile devices
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Offline Support**: Local storage fallback when offline

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase (Authentication, Firestore)
- **Weather API**: OpenWeatherMap
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Authentication and Firestore enabled
- OpenWeatherMap API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Configure Firebase:
   - Enable Authentication with Google provider
   - Enable Firestore database
   - Update Firestore rules to allow authenticated users to read/write their own data

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── city/[name]/        # Dynamic city detail pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── store.ts            # Redux store configuration
├── components/             # Reusable UI components
│   ├── ui/                 # Radix UI components
│   └── ...                 # Custom components
├── features/               # Redux slices and business logic
│   ├── cities/             # Cities state management
│   └── weather/            # Weather data management
├── firebase/               # Firebase configuration and utilities
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and types
└── pages/                  # Page components
```

## Usage

1. **Search for Cities**: Use the search bar in the header to find cities
2. **Add to Favorites**: Click on a city from search results to add it to your dashboard
3. **View Details**: Click on any city card to see detailed weather information
4. **Manage Favorites**: Use the heart icon to add/remove cities from favorites
5. **Sign In**: Click the sign-in button to sync your favorites across devices
6. **Toggle Units**: Switch between Celsius and Fahrenheit using the toggle button

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
