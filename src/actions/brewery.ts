"use server";

import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { geocodeAddress } from "@/lib/maps/geocoding";
import {
  createBrewerySchema,
  updateBrewerySchema,
  type CreateBreweryValues,
  type UpdateBreweryValues,
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

type UpdateBreweryData = Omit<UpdateBreweryValues, "slug">;

export async function updateBreweryAction(id: string, data: UpdateBreweryData) {
  // TODO: Add permission check (e.g., hasAccessToBrewery())

  const validationResult = updateBrewerySchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  try {
    const currentBrewery = await db.query.brewery.findFirst({
      where: eq(brewery.id, id),
    });
    if (!currentBrewery) {
      return { success: false, error: "Brewery not found." };
    }

    let lat = currentBrewery.location?.y;
    let lng = currentBrewery.location?.x;
    let formattedAddress = currentBrewery.formattedAddress;

    const addressChanged =
      validatedData.addressLine1 !== currentBrewery.addressLine1 ||
      validatedData.addressLine2 !== currentBrewery.addressLine2 ||
      validatedData.city !== currentBrewery.city ||
      validatedData.postcode !== currentBrewery.postcode;

    if (
      addressChanged &&
      validatedData.addressLine1 &&
      validatedData.city &&
      validatedData.postcode
    ) {
      try {
        const geocodeResult = await geocodeAddress({
          addressLine1: validatedData.addressLine1,
          addressLine2: validatedData.addressLine2,
          city: validatedData.city,
          postcode: validatedData.postcode,
        });
        lat = geocodeResult.lat;
        lng = geocodeResult.lng;
        formattedAddress = `${validatedData.addressLine1}${validatedData.addressLine2 ? `, ${validatedData.addressLine2}` : ""}, ${validatedData.city}, ${validatedData.postcode}`;
      } catch (geocodeError) {
        console.error(
          "Failed to geocode address during brewery update:",
          geocodeError
        );
        // Decide if you want to fail the whole update or proceed without new coords
        return { success: false, error: "Failed to geocode new address." };
      }
    }

    const [updatedBrewery] = await db
      .update(brewery)
      .set({
        ...validatedData,
        location:
          lat && lng ? sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)` : null,
        formattedAddress: addressChanged
          ? formattedAddress
          : currentBrewery.formattedAddress,
        updatedAt: new Date(),
      })
      .where(eq(brewery.id, id))
      .returning();

    if (!updatedBrewery) {
      throw new Error("Database failed to return updated brewery.");
    }

    revalidatePath("/breweries");
    revalidatePath(`/breweries/${updatedBrewery.slug}`);
    revalidatePath("/dashboard/brewery"); // Revalidate dashboard path

    return { success: true, data: updatedBrewery };
  } catch (error) {
    console.error("Error updating brewery:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update brewery",
    };
  }
}

type UpdateBreweryImageInput = {
  breweryId: string;
  type: "logo" | "cover";
  path: string;
};

export async function updateBreweryImageAction({
  breweryId,
  type,
  path,
}: UpdateBreweryImageInput) {
  // TODO: Add permission check (e.g., hasAccessToBrewery())
  try {
    const updateData = type === "logo" ? { logo: path } : { coverImage: path };

    const [updatedBrewery] = await db
      .update(brewery)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(brewery.id, breweryId))
      .returning({ slug: brewery.slug });

    if (!updatedBrewery) {
      return {
        success: false,
        error: "Brewery not found or failed to update.",
      };
    }

    revalidatePath("/breweries");
    revalidatePath(`/breweries/${updatedBrewery.slug}`);
    revalidatePath("/dashboard/brewery"); // Revalidate dashboard path

    return { success: true };
  } catch (error) {
    console.error(`Error updating brewery ${type}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `Failed to update brewery ${type}`,
    };
  }
}

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
