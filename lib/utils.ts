// @ts-nocheck

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
export const compareArrays = (array1: any, array2: any) => {
  if (array1.length !== array2.length) return false;
  const neww = (object: any) =>
    JSON.stringify(
      Object.keys(object)
        .sort()
        .map((key) => [key, object[key]])
    );
  array1 = new Set(array1.map(neww));
  return array2.every((object: any) => array1.has(neww(object)));
};

export const filterArray = (array: any, property: any) => {
  return array
    .filter((item: any) => item.name == property)
    .map((s: any) => {
      return s.value;
    });
};

export const removeDuplicates = (array: any) => {
  return [...new Set(array)];
};

export const randomize = (array: any) => {
  return [...array].sort(() => 0.5 - Math.random());
};
