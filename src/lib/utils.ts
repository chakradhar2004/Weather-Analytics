
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTemperature(temp: number, unit: 'metric' | 'imperial'): number {
  // Assuming input is always Celsius from the API for simplicity
  if (unit === 'imperial') {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
}
    