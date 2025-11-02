import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTemperature(tempInCelsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((tempInCelsius * 9/5) + 32);
  }
  return Math.round(tempInCelsius);
}
