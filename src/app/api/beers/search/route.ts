import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 1) {
    return NextResponse.json({ beers: [] });
  }

  // Split search into words and create conditions for each word
  const searchTerms = search.split(" ").filter(Boolean);
  const conditions = searchTerms.map((term) =>
    or(ilike(beer.name, `%${term}%`), ilike(brewery.name, `%${term}%`))
  );

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
    .where(and(...conditions))
    .limit(10);

  return NextResponse.json({ beers });
}
