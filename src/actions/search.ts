"use server";

import { db } from "@/db";
import { bar, brewery, type Bar, type Brewery } from "@/db/schema";
import { and, ilike } from "drizzle-orm";

// import { auth } from '@/lib/auth/auth'; // Placeholder for auth if needed

// Define the Venue type combining Bar and Brewery with an added 'type' field
export type VenueSearchResult = (Bar | Brewery) & { type: "bar" | "brewery" };

export async function searchVenuesAction(query: string) {
  if (!query || query.length < 1) {
    return { success: true, data: [] };
  }

  try {
    const searchTerms = query.split(" ").filter(Boolean);
    const nameConditions = searchTerms.map((term) =>
      ilike(brewery.name, `%${term}%`)
    );
    const barNameConditions = searchTerms.map((term) =>
      ilike(bar.name, `%${term}%`)
    );

    const breweries = await db.query.brewery.findMany({
      where: and(...nameConditions),
      limit: 10, // Limit results per type
    });

    const bars = await db.query.bar.findMany({
      where: and(...barNameConditions),
      limit: 10, // Limit results per type
    });

    // Combine and add type
    const venues: VenueSearchResult[] = [
      ...bars.map((b) => ({ ...b, type: "bar" as const })),
      ...breweries.map((br) => ({ ...br, type: "brewery" as const })),
    ];

    // Optional: Sort combined results
    venues.sort((a, b) => a.name.localeCompare(b.name));

    return { success: true, data: venues };
  } catch (error) {
    console.error("Error searching venues:", error);
    return { success: false, error: "Failed to search venues." };
  }
}
