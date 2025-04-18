import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 1) {
    return NextResponse.json({ beers: [] });
  }

  const beers = await db
    .select({
      id: beer.id,
      name: beer.name,
      brewery: {
        name: brewery.name,
      },
    })
    .from(beer)
    .leftJoin(brewery, eq(beer.breweryId, brewery.id))
    .where(
      or(ilike(beer.name, `%${search}%`), ilike(brewery.name, `%${search}%`))
    )
    .limit(10);

  console.log("Search query:", search);
  console.log("Found beers:", beers);

  return NextResponse.json({ beers });
}
