'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const LOCAL_FAVORITES_KEY = 'weatherwise-favorites';
const DEFAULT_FAVORITES = ['New York', 'London', 'Tokyo'];

type FavoriteCityDoc = {
  name: string;
  userId: string;
};

export const useFavorites = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const favoriteCitiesColRef = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'favoriteCities') : null),
    [firestore, user]
  );

  const { data: firestoreFavorites, isLoading: areFirestoreFavoritesLoading } = useCollection<FavoriteCityDoc>(favoriteCitiesColRef);

  useEffect(() => {
    setIsMounted(true);
    if (!user && !isUserLoading) {
      try {
        const storedFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
        if (storedFavorites) {
          setLocalFavorites(JSON.parse(storedFavorites));
        } else {
          setLocalFavorites(DEFAULT_FAVORITES);
        }
      } catch (error) {
        console.error("Could not access localStorage", error);
        setLocalFavorites(DEFAULT_FAVORITES);
      }
    }
  }, [user, isUserLoading]);

  const favorites = user
    ? firestoreFavorites?.map(fav => fav.name) ?? []
    : localFavorites;
  const isLoading = isUserLoading || (user && areFirestoreFavoritesLoading);


  const updateStoredFavorites = (newFavorites: string[]) => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Could not access localStorage", error);
      }
    }
  };

  const addFavorite = useCallback((city: string) => {
    if (user && firestore) {
      if (favorites.includes(city)) return;
      const newFav = {
        userId: user.uid,
        name: city,
        cityId: city.toLowerCase().replace(/ /g, '-'),
      };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'favoriteCities'), newFav);
    } else {
      setLocalFavorites(prevFavorites => {
        if (prevFavorites.includes(city)) {
          return prevFavorites;
        }
        const newFavorites = [...prevFavorites, city];
        updateStoredFavorites(newFavorites);
        return newFavorites;
      });
    }
  }, [user, firestore, favorites]);

  const removeFavorite = useCallback((city: string) => {
    if (user && firestore) {
      const favoriteToDelete = firestoreFavorites?.find(fav => fav.name === city);
      if (favoriteToDelete) {
        const docRef = doc(firestore, 'users', user.uid, 'favoriteCities', favoriteToDelete.id);
        deleteDocumentNonBlocking(docRef);
      }
    } else {
      setLocalFavorites(prevFavorites => {
        const newFavorites = prevFavorites.filter(c => c !== city);
        updateStoredFavorites(newFavorites);
        return newFavorites;
      });
    }
  }, [user, firestore, firestoreFavorites]);

  const isFavorite = useCallback((city: string) => {
    return favorites.includes(city);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, isMounted: isMounted && !isLoading };
};
