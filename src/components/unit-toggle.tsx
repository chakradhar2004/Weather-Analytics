
'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { setUnit } from '@/features/cities/citiesSlice';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

const UnitToggle = () => {
  const dispatch = useAppDispatch();
  const { unit, hydrated } = useAppSelector((state) => state.cities);
  
  if (!hydrated) {
      return <div className="w-20 h-8 rounded-md bg-secondary" />; // Placeholder
  }

  return (
    <div className="flex items-center rounded-md bg-secondary p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch(setUnit('metric'))}
        className={cn(
          'px-2.5 py-1 h-auto text-sm',
          unit === 'metric' && 'bg-background shadow-sm'
        )}
      >
        °C
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch(setUnit('imperial'))}
        className={cn(
          'px-2.5 py-1 h-auto text-sm',
          unit === 'imperial' && 'bg-background shadow-sm'
        )}
      >
        °F
      </Button>
    </div>
  );
};

export default UnitToggle;
    