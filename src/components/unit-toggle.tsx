'use client';

import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const UnitToggle = () => {
  const { unit, setUnit } = useSettings();

  return (
    <div className="flex items-center rounded-md bg-secondary p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setUnit('C')}
        className={cn(
          'px-2.5 py-1 h-auto text-sm',
          unit === 'C' && 'bg-background shadow-sm'
        )}
      >
        °C
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setUnit('F')}
        className={cn(
          'px-2.5 py-1 h-auto text-sm',
          unit === 'F' && 'bg-background shadow-sm'
        )}
      >
        °F
      </Button>
    </div>
  );
};

export default UnitToggle;
