"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'weatherwise-favorites';
const DEFAULT_FAVORITES = ['New York', 'London', 'Tokyo'];

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites(DEFAULT_FAVORITES);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
      setFavorites(DEFAULT_FAVORITES);
    }
  }, []);

  const updateStoredFavorites = (newFavorites: string[]) => {
    if (isMounted) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Could not access localStorage", error);
      }
    }
  };

  const addFavorite = useCallback((city: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(city)) {
        return prevFavorites;
      }
      const newFavorites = [...prevFavorites, city];
      updateStoredFavorites(newFavorites);
      return newFavorites;
    });
  }, [isMounted]);

  const removeFavorite = useCallback((city: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(c => c !== city);
      updateStoredFavorites(newFavorites);
      return newFavorites;
    });
  }, [isMounted]);

  const isFavorite = useCallback((city: string) => {
    return favorites.includes(city);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, isMounted };
};
