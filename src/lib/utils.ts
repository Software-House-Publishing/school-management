// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + conditional class names.
 * Used across components as `cn(...)`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
