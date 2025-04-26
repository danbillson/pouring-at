"use server";

import { db } from "@/db";
import { bar, beer, brewery, tap } from "@/db/schema";
import { geocodeAddress } from "@/lib/maps/geocoding";
import { createBarSchema, type CreateBarValues } from "@/lib/schemas/bar";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Fetching Helpers ---

export async function getBar(id: string) {
  return await db.query.bar.findFirst({
    where: eq(bar.id, id),
  });
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
  logo: string | null;
  cover_image: string | null;
  taps: Array<{
    beer: { id: string; name: string; style: string; abv: number | null };
    brewery: { id: string; name: string; slug: string };
  }>;
};

export async function searchBars({
  lat,
  lng,
  radius = 5, // Default 5km radius
  style,
  brewery: breweryId, // Renamed for clarity in SQL
}: SearchParams): Promise<BarWithTaps[]> {
  const point = sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`;

  const nearbyBarsQuery = sql`
    WITH nearby_bars AS (
      SELECT 
        b.id AS bar_id,
        b.name AS bar_name,
        b.logo AS logo,
        b.cover_image AS cover_image,
        ST_Y(b.location::geometry) AS lat,
        ST_X(b.location::geometry) AS lng,
        ST_Distance(
          b.location::geometry,
          ${point}::geometry,
          true
        ) / 1000 AS distance_km
      FROM ${bar} b
      WHERE ST_DWithin(
        b.location::geometry,
        ${point}::geometry,
        ${radius * 1000},
        true
      )
    ),
    matching_bars AS (
      SELECT DISTINCT t.bar_id
      FROM ${tap} t
      INNER JOIN ${beer} be ON be.id = t.beer_id
      INNER JOIN ${brewery} br ON br.id = be.brewery_id
      WHERE t.tapped_off IS NULL
      ${style ? sql`AND be.style = ${style}` : sql``}
      ${breweryId ? sql`AND br.id = ${breweryId}` : sql``}
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
              'abv', be.abv -- Select as numeric directly
            ),
            'brewery', json_build_object(
              'id', br.id,
              'name', br.name,
              'slug', br.slug
            )
          )
        ) FILTER (WHERE t.id IS NOT NULL) AS taps
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
      nb.logo,
      nb.cover_image,
      COALESCE(bt.taps, '[]'::json) AS taps
    FROM nearby_bars nb
    ${style || breweryId ? sql`INNER JOIN matching_bars mb ON mb.bar_id = nb.bar_id` : sql``}
    LEFT JOIN bar_taps bt ON bt.bar_id = nb.bar_id
    ORDER BY nb.distance_km ASC
    LIMIT 20
  `;

  return db.execute(nearbyBarsQuery);
}

// --- Mutation Actions ---

export async function createBarAction(data: CreateBarValues) {
  // 1. Validate input on the server using the shared schema
  const validationResult = createBarSchema.safeParse(data);
  if (!validationResult.success) {
    // Extract specific Zod errors if needed, or return a generic message
    // console.error("Validation failed:", validationResult.error.flatten());
    return { success: false, error: "Invalid form data submitted." };
  }

  // Use validatedData from now on
  const validatedData = validationResult.data;

  // TODO: Add Authentication/Authorization if needed
  // const session = await auth.api.getSession(...);
  // if (!session?.user) { return { success: false, error: "Unauthorized" }; }

  try {
    const { lat, lng } = await geocodeAddress({
      addressLine1: validatedData.addressLine1,
      addressLine2: validatedData.addressLine2,
      city: validatedData.city,
      postcode: validatedData.postcode,
    });

    if (!lat || !lng) {
      return { success: false, error: "Failed to find address" };
    }

    // TODO: Add slug generation if needed, check for uniqueness
    // const slug = createSlug(data.name);
    // const existing = await db.query.bar.findFirst({ where: eq(bar.slug, slug) });
    // if (existing) { return { success: false, error: "Bar name already taken" }; }

    const [barData] = await db
      .insert(bar)
      .values({
        name: validatedData.name,
        // slug: slug,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2 || null,
        city: validatedData.city,
        postcode: validatedData.postcode,
        location: sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`,
        formattedAddress: `${validatedData.addressLine1}${validatedData.addressLine2 ? `, ${validatedData.addressLine2}` : ""}, ${validatedData.city}, ${validatedData.postcode}`,
        // createdById: session.user.id, // Add if tracking creator
        // organizationId: session.user.organizationId, // If applicable
      })
      .returning();

    if (!barData) {
      throw new Error("Database failed to return created bar.");
    }

    // Revalidate relevant paths
    revalidatePath("/bars"); // Example path for a public list
    revalidatePath("/search"); // Revalidate search page
    // Revalidate specific bar page?
    // revalidatePath(`/bars/${barData.slug}`);

    return { success: true, data: barData };
  } catch (error) {
    console.error("Failed to create bar:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create bar" };
  }
}

// TODO: Add updateBarAction
// TODO: Add deleteBarAction
