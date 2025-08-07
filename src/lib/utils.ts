import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSensorId(string: string) {
  const x = string.replace("-", " ");
  return x.charAt(0).toUpperCase() + x.slice(1);
}

