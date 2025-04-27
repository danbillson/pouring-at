import { createSearchParamsCache, parseAsString } from "nuqs/server";

// Define the parsers for search parameters
// These can be shared between server and client components
export const searchFiltersParsers = {
  location: parseAsString.withDefault(""),
  style: parseAsString.withDefault(""),
  brewery: parseAsString.withDefault(""),
};

// Create a server-side cache using the defined parsers
// This allows type-safe access in Server Components
export const searchParamsCache = createSearchParamsCache(searchFiltersParsers);
