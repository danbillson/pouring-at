"use server";

import { db } from "@/db";
import { brewery } from "@/db/schema";
import { geocodeAddress } from "@/lib/geocoding";
import { createSlug } from "@/lib/utils";
import { eq, ilike, sql } from "drizzle-orm";

export type Brewery = {
  id: string;
  name: string;
  slug: string;
  formattedAddress?: string;
};

export type CreateBreweryInput = {
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
};

export async function getBrewery(id: string) {
  const [breweryData] = await db
    .select()
    .from(brewery)
    .where(eq(brewery.id, id));
  return breweryData;
}

export async function searchBreweries(search: string) {
  if (!search || search.length < 1) {
    return [];
  }

  const breweries = await db
    .select({
      id: brewery.id,
      name: brewery.name,
      slug: brewery.slug,
      formattedAddress: brewery.formattedAddress,
    })
    .from(brewery)
    .where(ilike(brewery.name, `%${search}%`))
    .limit(10);

  return breweries as Brewery[];
}

async function generateUniqueSlug(name: string) {
  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 1;

  // Keep checking until we find a unique slug
  while (true) {
    const existing = await db
      .select({ slug: brewery.slug })
      .from(brewery)
      .where(eq(brewery.slug, slug));

    if (existing.length === 0) {
      return slug;
    }

    // If slug exists, append counter and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createBrewery(data: CreateBreweryInput) {
  try {
    let location = null;
    let formattedAddress = null;

    // Generate a unique slug from the brewery name
    const slug = await generateUniqueSlug(data.name);

    // Only geocode if all address fields are provided
    if (data.addressLine1 && data.city && data.postcode) {
      const { lat, lng } = await geocodeAddress({
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        postcode: data.postcode,
      }).catch((error) => {
        console.error("Failed to geocode address:", error);
        return { lat: null, lng: null };
      });

      if (lat && lng) {
        location = sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`;
        formattedAddress = `${data.addressLine1}${
          data.addressLine2 ? `, ${data.addressLine2}` : ""
        }, ${data.city}, ${data.postcode}`;
      }
    }

    const [breweryData] = await db
      .insert(brewery)
      .values({
        name: data.name,
        slug,
        addressLine1: data.addressLine1 || null,
        addressLine2: data.addressLine2 || null,
        city: data.city || null,
        postcode: data.postcode || null,
        location,
        formattedAddress,
      })
      .returning();

    return { success: true, data: breweryData };
  } catch (error) {
    console.error("Failed to create brewery:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create brewery" };
  }
}
