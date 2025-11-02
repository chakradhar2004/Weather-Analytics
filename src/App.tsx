import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { FirebaseClientProvider } from './firebase';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard';
import CityPage from './pages/CityPage';
import AppHeader from './components/app-header';
import './app/globals.css';

function App() {
  console.log('App component rendering');
  return (
    <Provider store={store}>
      <FirebaseClientProvider>
        <Router>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/city/:name" element={<CityPage />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </FirebaseClientProvider>
    </Provider>
  );
}

export default App;
