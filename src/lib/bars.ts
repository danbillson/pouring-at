"use server";

import { db } from "@/db";
import { bar } from "@/db/schema";
import { geocodeAddress } from "@/lib/geocoding";
import { eq, sql } from "drizzle-orm";

export type CreateBarInput = {
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
};

export async function getBar(slug: string) {
  const [barData] = await db.select().from(bar).where(eq(bar.slug, slug));
  return barData;
}

export async function createBar(data: CreateBarInput) {
  try {
    const { lat, lng } = await geocodeAddress({
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      postcode: data.postcode,
    }).catch((error) => {
      console.error("Failed to geocode address:", error);
      throw new Error("Failed to find address");
    });

    if (!lat || !lng) {
      return { success: false, error: "Failed to find address" };
    }

    const [barData] = await db
      .insert(bar)
      .values({
        name: data.name,
        slug: data.slug,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        postcode: data.postcode,
        location: sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`,
        formattedAddress: `${data.addressLine1}${
          data.addressLine2 ? `, ${data.addressLine2}` : ""
        }, ${data.city}, ${data.postcode}`,
      })
      .returning();

    return { success: true, data: barData };
  } catch (error) {
    console.error("Failed to create bar:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create bar" };
  }
}
