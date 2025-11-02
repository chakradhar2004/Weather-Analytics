import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { FirebaseClientProvider } from './firebase';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard';
import CityPage from './pages/CityPage';
import './app/globals.css';

function App() {
  return (
    <Provider store={store}>
      <FirebaseClientProvider>
        <Router>
          <div className="relative flex min-h-screen flex-col">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/city/:name" element={<CityPage />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </FirebaseClientProvider>
    </Provider>
  );
}

export default App;
