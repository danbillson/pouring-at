import { db } from "@/db";
import { bar } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const createBarSchema = z.object({
  name: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = createBarSchema.parse(json);

    // TODO: Geocoding integration
    // const { lat, lng } = await geocodeAddress({
    //   addressLine1: body.addressLine1,
    //   addressLine2: body.addressLine2,
    //   city: body.city,
    //   postcode: body.postcode,
    // });

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    await db.insert(bar).values({
      name: body.name,
      slug,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 || null,
      city: body.city,
      postcode: body.postcode,
      // Temporary: Setting a dummy location in London
      location: sql`ST_SetSRID(ST_Point(-0.1276, 51.5074), 4326)`,
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
