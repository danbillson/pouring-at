"use server";

import { db } from "@/db";
import { bar, beer, brewery, tap } from "@/db/schema";
import { hasAccessToBar } from "@/lib/auth/access";
import { geocodeAddress } from "@/lib/maps/geocoding";
import {
  createBarSchema,
  updateBarSchema,
  type CreateBarValues,
  type UpdateBarValues,
} from "@/lib/schemas/bar";
import { eq, sql, ilike, and } from "drizzle-orm";
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

// --- Name-based Bar Search (for BarSearch component) ---
export async function queryBars(query: string) {
  if (!query || query.length < 1) {
    return { success: true, data: [] };
  }
  try {
    const searchTerms = query.split(" ").filter(Boolean);
    const nameConditions = searchTerms.map((term) =>
      ilike(bar.name, `%${term}%`)
    );
    const bars = await db.query.bar.findMany({
      where: and(...nameConditions),
      columns: {
        id: true,
        name: true,
        slug: true,
      },
      limit: 10,
    });
    return { success: true, data: bars };
  } catch (error) {
    console.error("Error querying bars by name:", error);
    return { success: false, error: "Failed to search bars." };
  }
}

// --- Mutation Actions ---

export async function createBarAction(data: CreateBarValues) {
  const validationResult = createBarSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: "Invalid form data submitted." };
  }

  const validatedData = validationResult.data;

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

    const [barData] = await db
      .insert(bar)
      .values({
        name: validatedData.name,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2 || null,
        city: validatedData.city,
        postcode: validatedData.postcode,
        location: sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`,
        formattedAddress: `${validatedData.addressLine1}${validatedData.addressLine2 ? `, ${validatedData.addressLine2}` : ""}, ${validatedData.city}, ${validatedData.postcode}`,
        // createdById: session.user.id, // Add if tracking creator
      })
      .returning();

    if (!barData) {
      throw new Error("Database failed to return created bar.");
    }

    return { success: true, data: barData };
  } catch (error) {
    console.error("Failed to create bar:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create bar" };
  }
}

type UpdateBarData = Omit<UpdateBarValues, "slug" | "logo" | "coverImage">;

export async function updateBarAction(id: string, data: UpdateBarData) {
  await hasAccessToBar();

  const validationResult = updateBarSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  try {
    const currentBar = await db.query.bar.findFirst({ where: eq(bar.id, id) });
    if (!currentBar) {
      return { success: false, error: "Bar not found." };
    }

    let lat = currentBar.location?.y;
    let lng = currentBar.location?.x;
    let formattedAddress = currentBar.formattedAddress;

    const addressChanged =
      currentBar.addressLine1 !== validatedData.addressLine1 ||
      currentBar.addressLine2 !== (validatedData.addressLine2 || null) ||
      currentBar.city !== validatedData.city ||
      currentBar.postcode !== validatedData.postcode;

    if (addressChanged) {
      const geocodeResult = await geocodeAddress({
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2,
        city: validatedData.city,
        postcode: validatedData.postcode,
      });
      if (!geocodeResult.lat || !geocodeResult.lng) {
        console.warn("Failed to re-geocode address for bar:", id);

        return { success: false, error: "Failed to find new address." };
      } else {
        lat = geocodeResult.lat;
        lng = geocodeResult.lng;
        formattedAddress = `${validatedData.addressLine1}${validatedData.addressLine2 ? `, ${validatedData.addressLine2}` : ""}, ${validatedData.city}, ${validatedData.postcode}`;
      }
    }

    const [updatedBar] = await db
      .update(bar)
      .set({
        name: validatedData.name,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2 || null,
        city: validatedData.city,
        postcode: validatedData.postcode,
        location: sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`,
        formattedAddress: formattedAddress,
        updatedAt: new Date(),
      })
      .where(eq(bar.id, id))
      .returning();

    if (!updatedBar) {
      throw new Error("Database failed to return updated bar.");
    }

    // Revalidate paths
    revalidatePath(`/dashboard/bar`); // Revalidate the general dashboard area
    revalidatePath(`/bars/${updatedBar.id}`); // Revalidate specific bar page if it exists

    return { success: true, data: updatedBar };
  } catch (error) {
    console.error("Failed to update bar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update bar",
    };
  }
}

// --- Update Bar Image Action ---
type UpdateBarImageInput = {
  barId: string;
  type: "logo" | "cover";
  path: string;
};

export async function updateBarImageAction({
  barId,
  type,
  path,
}: UpdateBarImageInput) {
  await hasAccessToBar();

  try {
    const fieldToUpdate =
      type === "logo" ? { logo: path } : { coverImage: path };

    const [updatedBar] = await db
      .update(bar)
      .set({
        ...fieldToUpdate,
        updatedAt: new Date(),
      })
      .where(eq(bar.id, barId))
      .returning({ id: bar.id, slug: bar.slug });

    if (!updatedBar) {
      throw new Error(
        "Database failed to return updated bar after image update."
      );
    }

    revalidatePath(`/dashboard/bar`);
    revalidatePath(`/bars/${updatedBar.id}`);

    return { success: true, data: updatedBar };
  } catch (error) {
    console.error(`Failed to update bar ${type}:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : `Failed to update bar ${type}`,
    };
  }
}

// TODO: Add deleteBarAction
