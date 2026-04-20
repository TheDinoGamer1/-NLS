import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateTitle(input: string, max = 72): string {
  const compact = input.replace(/\s+/g, " ").trim();
  if (!compact) return "New Chat";
  return compact.length <= max ? compact : `${compact.slice(0, max)}...`;
}
