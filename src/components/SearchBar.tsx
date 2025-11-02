'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { searchCities } from '@/api/weatherApi';
import type { CitySearchResult } from '@/lib/types';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { MapPin, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  onCitySelect: (city: { id: number; name: string; country: string }) => void;
}

export default function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      setLoading(true);
      searchCities(debouncedQuery)
        .then((cities) => {
          setResults(cities);
          setIsOpen(true);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (city: CitySearchResult) => {
    onCitySelect({ id: city.id, name: city.name, country: city.country });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[cmdk-input]')?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command shouldFilter={false} className="relative max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search for a city..."
          className="pl-9 h-9"
          onFocus={() => query.length > 1 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      {isOpen && (
        <CommandList className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {loading ? (
            <CommandItem disabled>Loading...</CommandItem>
          ) : (
            results.map((city) => (
              <CommandItem
                key={city.id}
                onSelect={() => handleSelect(city)}
                value={city.name}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {city.name}, {city.country}
                </span>
              </CommandItem>
            ))
          )}
          <CommandEmpty>{debouncedQuery.length > 1 && !loading && "No results found."}</CommandEmpty>
        </CommandList>
      )}
    </Command>
  );
}
