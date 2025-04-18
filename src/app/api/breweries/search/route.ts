import { db } from "@/db";
import { brewery } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 1) {
    return NextResponse.json({ breweries: [] });
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

  return NextResponse.json({ breweries });
}
