'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { addFavorite, removeFavorite, setFavorites, hydrate, saveFavoritesToFirestore } from '@/features/cities/citiesSlice';
import { fetchWeatherForCity } from '@/features/weather/weatherSlice';
import CityCard from '@/components/CityCard';
import type { City } from '@/lib/types';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favorites, hydrated } = useAppSelector((state) => state.cities);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // This effect runs once on mount to hydrate state from localStorage
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // This effect syncs favorites between Firestore and Redux/localStorage
  useEffect(() => {
    if (isUserLoading || !hydrated) return;

    let unsubscribe = () => {};

    if (user && firestore) {
      // User is logged in, use Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      
      // Create user document if it doesn't exist
      setDoc(userDocRef, { email: user.email, displayName: user.displayName, photoURL: user.photoURL }, { merge: true })
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'write',
                requestResourceData: { email: user.email },
              })
            );
        });

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const firestoreFavorites = data.favoriteCities || [];
          dispatch(setFavorites(firestoreFavorites));
        }
      }, (error) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: userDocRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
      });
    } else {
      // User is logged out, use localStorage (which is already handled by `hydrate`)
    }

    return () => unsubscribe();
  }, [user, isUserLoading, firestore, hydrated, dispatch]);

  // This effect fetches weather data for favorites whenever they change
  useEffect(() => {
    if (!hydrated || favorites.length === 0) return;
    
    favorites.forEach((city) => {
      dispatch(fetchWeatherForCity(city.name));
    });

    const interval = setInterval(() => {
        favorites.forEach((city) => {
            dispatch(fetchWeatherForCity(city.name));
          });
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [favorites, dispatch, hydrated]);


  const handleToggleFavorite = (city: City) => {
    const isFav = favorites.some(fav => fav.id === city.id);
    if (isFav) {
      dispatch(removeFavorite(city.id));
    } else {
      dispatch(addFavorite(city));
    }
    if (user) {
        // @ts-ignore
        dispatch(saveFavoritesToFirestore());
    }
  };

  const handleCardClick = (city: City) => {
      router.push(`/city/${encodeURIComponent(city.name)}`);
  }

  if (!hydrated || isUserLoading) {
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
