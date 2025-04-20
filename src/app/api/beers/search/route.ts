import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 1) {
    return NextResponse.json({ beers: [] });
  }

  const beers = await db.query.beer.findMany({
    where: or(
      ilike(beer.name, `%${search}%`),
      ilike(brewery.name, `%${search}%`)
    ),
    limit: 10,
    with: {
      brewery: true,
    },
  });

  return NextResponse.json({ beers });
}
