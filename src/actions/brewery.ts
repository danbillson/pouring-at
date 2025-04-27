"use server";

import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { geocodeAddress } from "@/lib/maps/geocoding";
import {
  createBrewerySchema,
  type CreateBreweryValues,
} from "@/lib/schemas/brewery";
import { and, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Fetching Actions ---

export async function getBreweryAction(id: string) {
  try {
    const breweryData = await db.query.brewery.findFirst({
      where: eq(brewery.id, id),
    });
    return { success: true, data: breweryData };
  } catch (error) {
    console.error("Error fetching brewery:", error);
    return { success: false, error: "Failed to fetch brewery data." };
  }
}

export async function getBreweryBeersAction(breweryId: string) {
  try {
    const beers = await db.query.beer.findMany({
      where: eq(beer.breweryId, breweryId),
    });
    return { success: true, data: beers };
  } catch (error) {
    console.error("Error fetching brewery beers:", error);
    return { success: false, error: "Failed to fetch brewery beers." };
  }
}

// --- Mutation Actions ---

export async function createBreweryAction(data: CreateBreweryValues) {
  const validationResult = createBrewerySchema.safeParse(data);
  if (!validationResult.success) {
    console.error(
      "Brewery validation failed:",
      validationResult.error.flatten()
    );
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  try {
    let location = null;
    let formattedAddress = null;

    if (
      validatedData.addressLine1 &&
      validatedData.city &&
      validatedData.postcode
    ) {
      try {
        const { lat, lng } = await geocodeAddress({
          addressLine1: validatedData.addressLine1,
          addressLine2: validatedData.addressLine2,
          city: validatedData.city,
          postcode: validatedData.postcode,
        });
        location = sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`;
        formattedAddress = `${validatedData.addressLine1}${validatedData.addressLine2 ? `, ${validatedData.addressLine2}` : ""}, ${validatedData.city}, ${validatedData.postcode}`;
      } catch (geocodeError) {
        console.error(
          "Failed to geocode address during brewery creation:",
          geocodeError
        );
      }
    }

    const [newBrewery] = await db
      .insert(brewery)
      .values({
        name: validatedData.name,
        addressLine1: validatedData.addressLine1 ?? null,
        addressLine2: validatedData.addressLine2 ?? null,
        city: validatedData.city ?? null,
        postcode: validatedData.postcode ?? null,
        location,
        formattedAddress,
      })
      .returning();

    if (!newBrewery) {
      throw new Error("Database failed to return created brewery.");
    }

    revalidatePath("/breweries");
    revalidatePath(`/breweries/${newBrewery.slug}`);
    revalidatePath("/search");
    revalidatePath("/dashboard/brewery");

    return { success: true, data: newBrewery };
  } catch (error) {
    console.error("Error creating brewery:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        success: false,
        error: "A brewery with this name might already exist.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create brewery",
    };
  }
}

// TODO: Add updateBreweryAction
// TODO: Add deleteBreweryAction

// --- Search Action ---

export async function searchBreweriesAction(query: string) {
  if (!query || query.length < 1) {
    return { success: true, data: [] };
  }

  try {
    // Split search into words and create conditions for each word
    const searchTerms = query.split(" ").filter(Boolean);
    const nameConditions = searchTerms.map((term) =>
      ilike(brewery.name, `%${term}%`)
    );
    // Add other searchable fields if needed, e.g., city
    // const cityConditions = searchTerms.map((term) => ilike(brewery.city, `%${term}%`));
    // const conditions = searchTerms.map((term) => or(ilike(brewery.name, `%${term}%`), ilike(brewery.city, `%${term}%`)))

    const breweries = await db.query.brewery.findMany({
      where: and(...nameConditions),
      // Select specific fields needed for the search result display
      columns: {
        id: true,
        name: true,
        slug: true, // Keep slug if needed for links
        // formattedAddress: true, // Add if you want to display address in results
      },
      limit: 10, // Limit results
    });

    return { success: true, data: breweries };
  } catch (error) {
    console.error("Error searching breweries:", error);
    return { success: false, error: "Failed to search breweries." };
  }
}
