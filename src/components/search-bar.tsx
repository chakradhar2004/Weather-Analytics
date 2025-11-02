'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { searchCities } from '@/app/actions';
import type { City } from '@/lib/types';
import { MapPin, Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 1) {
      startTransition(async () => {
        const cities = await searchCities(searchQuery);
        setResults(cities);
        if (cities.length > 0) {
            setIsOpen(true);
        }
      });
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const handleSelect = (city: City) => {
    router.push(`/city/${city.name}`);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[cmdk-input]')?.focus();
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  return (
    <Command shouldFilter={false} className="relative max-w-sm">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <CommandInput
                value={query}
                onValueChange={handleSearch}
                placeholder="Search for a city..."
                className="pl-9 h-9"
                onFocus={() => query.length > 1 && setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
      {isOpen && (
        <CommandList className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {isPending ? (
            <CommandItem disabled>Loading...</CommandItem>
          ) : (
            results.map((city) => (
              <CommandItem
                key={`${city.name}-${city.country}`}
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
          <CommandEmpty>{query.length > 1 && !isPending && "No results found."}</CommandEmpty>
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
