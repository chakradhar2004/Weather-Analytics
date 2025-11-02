'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite, setFavorites, saveFavoritesToFirestore } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityCard from '@/components/CityCard';
import type { City } from '@/lib/types';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favorites } = useAppSelector((state) => state.cities);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Effect to sync favorites from Firestore when user logs in/out
  useEffect(() => {
    if (isUserLoading || !firestore) return; // Wait for user and firestore to be ready

    let unsubscribe = () => {};

    if (user) {
      // User is logged in, sync with Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = { 
        id: user.uid,
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL 
      };
      
      // Create or update user document, but don't block
      setDoc(userDocRef, userData, { merge: true })
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'write',
                requestResourceData: userData,
              })
            );
        });

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const firestoreFavorites = docSnap.data()?.favoriteCities || [];
          // Only dispatch if firestore data is different from redux state to avoid loops
          if (JSON.stringify(firestoreFavorites) !== JSON.stringify(favorites)) {
            dispatch(setFavorites(firestoreFavorites));
          }
        }
      }, (error) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: userDocRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
        console.error("Error listening to user document:", error);
      });

    } else {
      // User is logged out, load from localStorage
      // This is handled by the initial state of the slice now
    }

    return () => unsubscribe(); // Cleanup listener on unmount or user change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isUserLoading, firestore, dispatch]);


  // This effect fetches weather data for favorites whenever they change
  useEffect(() => {
    if (favorites.length === 0) return;
    
    const fetchAllWeather = () => {
      favorites.forEach((city) => {
        dispatch(fetchWeatherForCity(city.name));
      });
    };

    fetchAllWeather(); // Fetch immediately on change

    const interval = setInterval(fetchAllWeather, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [favorites, dispatch]);


  const handleToggleFavorite = (city: City) => {
    const isFav = favorites.some(fav => fav.id === city.id);
    if (isFav) {
      dispatch(removeFavorite(city.id));
    } else {
      dispatch(addFavorite(city));
    }
    // Save to Firestore if user is logged in
    if (user) {
        // @ts-ignore
        dispatch(saveFavoritesToFirestore());
    }
  };

  const handleCardClick = (city: City) => {
      router.push(`/city/${encodeURIComponent(city.name)}`);
  }

  if (isUserLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Cities</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorite Cities</h2>
          <p className="text-muted-foreground mb-4 max-w-sm">
            You haven't added any cities to your dashboard. Use the search bar to find and add cities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isFavorite={true}
              onFavClick={handleToggleFavorite}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
