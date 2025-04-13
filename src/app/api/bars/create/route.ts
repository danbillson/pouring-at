import { db } from "@/db";
import { bar } from "@/db/schema";
import { geocodeAddress } from "@/lib/geocoding";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const createBarSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = createBarSchema.parse(json);

    const { lat, lng } = await geocodeAddress({
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city,
      postcode: body.postcode,
    }).catch((error) => {
      console.error("Failed to geocode address:", error);
      throw new Error("Failed to find address");
    });

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Failed to find address" },
        { status: 422 }
      );
    }

    await db.insert(bar).values({
      name: body.name,
      slug: body.slug,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 || null,
      city: body.city,
      postcode: body.postcode,
      location: sql`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`,
      formattedAddress: `${body.addressLine1}${
        body.addressLine2 ? `, ${body.addressLine2}` : ""
      }, ${body.city}, ${body.postcode}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create bar:", error);
    return NextResponse.json(
      { error: "Failed to create bar" },
      { status: 500 }
    );
  }
}
