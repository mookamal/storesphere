// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type GenericObject = { 
  [key: string]: any 
};

export function cn(...inputs: any[]): string {
  return twMerge(clsx(inputs));
}

export function removeTypename(data: any): any {
  if (Array.isArray(data)) {
    return data.map(removeTypename);
  } else if (data !== null && typeof data === "object") {
    const cleaned: GenericObject = {};
    Object.keys(data).forEach(key => {
      if (key !== '__typename') {
        cleaned[key] = removeTypename(data[key]);
      }
    });
    return cleaned;
  }
  return data;
}