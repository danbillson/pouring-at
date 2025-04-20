"use server";

import { db } from "@/db";
import { brewery } from "@/db/schema";
import { geocodeAddress } from "@/lib/geocoding";
import { eq, sql } from "drizzle-orm";

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
  const breweryData = await db.query.brewery.findFirst({
    where: eq(brewery.id, id),
  });
  return breweryData;
}

export async function createBrewery(data: CreateBreweryInput) {
  try {
    let location = null;
    let formattedAddress = null;

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
