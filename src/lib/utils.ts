
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTemperature(temp: number, unit: 'metric' | 'imperial'): number {
  if (unit === 'metric') {
    return Math.round(temp);
  }
  // The API might provide temp_f directly. If not, conversion is needed.
  // This function currently just rounds the provided temp.
  // If the API always gives Celsius (temp_c) and we need Fahrenheit,
  // the calculation would be: Math.round((temp * 9/5) + 32)
  return Math.round(temp);
}
    