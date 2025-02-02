import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function removeTypename(data) {
  if (Array.isArray(data)) {
    return data.map(removeTypename);
  } else if (data !== null && typeof data === "object") {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (key !== '__typename') {
        cleaned[key] = removeTypename(data[key]);
      }
    });
    return cleaned;
  }
  return data;
}