"use server";

import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";

export type Beer = {
  id: string;
  name: string;
  brewery: {
    name: string;
  };
};

export async function searchBeers(search: string) {
  if (!search || search.length < 1) {
    return [];
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

  return beers as Beer[];
}
