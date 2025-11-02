'use client';

import React, { useEffect, useState } from 'react';
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


export default function Dashboard() {
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
          if (firestoreFavorites.length === 0 && favorites.length > 0) {
            // Firestore is empty, but we have local favorites, upload them
            dispatch(saveFavoritesToFirestore());
          } else {
            // Sync from Firestore
            if (JSON.stringify(firestoreFavorites) !== JSON.stringify(favorites)) {
              dispatch(setFavorites(firestoreFavorites));
            }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">My Cities</h1>
          <p className="text-gray-600 dark:text-gray-300">Your personalized weather dashboard</p>
        </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 border-2 border-dashed rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-6 shadow-lg">
            <Search className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No Favorite Cities Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
            Start building your personalized weather dashboard by searching for cities above and adding them to your favorites.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            💡 Tip: Try searching for your current location or favorite destinations
          </div>
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
    </div>
  );
}
