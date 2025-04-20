"use server";

import { db } from "@/db";
import { bar, beer, brewery, tap } from "@/db/schema";
import { geocodeAddress } from "@/lib/geocoding";
import { eq, sql } from "drizzle-orm";

export type CreateBarInput = {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
};

export async function getBar(id: string) {
  const [barData] = await db.select().from(bar).where(eq(bar.id, id));
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

type SearchParams = {
  lat: number;
  lng: number;
  radius?: number; // in kilometers
  style?: string;
  brewery?: string;
};

export type BarWithTaps = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance_km: number;
  taps: Array<{
    beer: { id: string; name: string; style: string; abv: number };
    brewery: { id: string; name: string; slug: string };
  }>;
};

export async function searchBars({
  lat,
  lng,
  radius = 5, // Default 5km radius
  style,
  brewery: brewerySlug,
}: SearchParams) {
  const point = sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`;

  const nearbyBars = sql`
    WITH nearby_bars AS (
      SELECT 
        b.id AS bar_id,
        b.name AS bar_name,
        ST_Y(b.location::geometry) AS lat,
        ST_X(b.location::geometry) AS lng,
        ST_Distance(
          b.location::geometry,
          ${point}::geometry,
          true  -- Use spheroid for more accurate distance
        ) / 1000 AS distance_km
      FROM ${bar} b
      WHERE ST_DWithin(
        b.location::geometry,
        ${point}::geometry,
        ${radius * 1000},  -- Convert km to meters
        true  -- Use spheroid for more accurate distance
      )
    ),
    matching_bars AS (
      SELECT DISTINCT t.bar_id
      FROM ${tap} t
      INNER JOIN ${beer} be ON be.id = t.beer_id
      INNER JOIN ${brewery} br ON br.id = be.brewery_id
      WHERE t.tapped_off IS NULL
      ${style ? sql`AND be.style = ${style}` : sql``}
      ${brewerySlug ? sql`AND br.slug = ${brewerySlug}` : sql``}
    ),
    bar_taps AS (
      SELECT 
        t.bar_id,
        json_agg(
          json_build_object(
            'beer', json_build_object(
              'id', be.id,
              'name', be.name,
              'style', be.style,
              'abv', be.abv
            ),
            'brewery', json_build_object(
              'id', br.id,
              'name', br.name,
              'slug', br.slug
            )
          )
        ) AS taps
      FROM ${tap} t
      INNER JOIN ${beer} be ON be.id = t.beer_id
      INNER JOIN ${brewery} br ON br.id = be.brewery_id
      WHERE t.tapped_off IS NULL
      GROUP BY t.bar_id
    )
    SELECT 
      nb.bar_id AS id,
      nb.bar_name AS name,
      nb.lat,
      nb.lng,
      nb.distance_km,
      COALESCE(bt.taps, '[]'::json) AS taps
    FROM nearby_bars nb
    ${style || brewerySlug ? sql`INNER JOIN matching_bars mb ON mb.bar_id = nb.bar_id` : sql``}
    LEFT JOIN bar_taps bt ON bt.bar_id = nb.bar_id
    ORDER BY nb.distance_km ASC
    LIMIT 20
  `;

  return db.execute(nearbyBars) as Promise<BarWithTaps[]>;
}
