"use server";

import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";

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

export interface CreateBeerInput {
  name: string;
  style: string;
  abv: number;
  description?: string;
  breweryId: string;
}

export async function createBeer(input: CreateBeerInput) {
  try {
    const existingBeer = await db
      .select()
      .from(beer)
      .where(
        and(eq(beer.name, input.name), eq(beer.breweryId, input.breweryId))
      )
      .limit(1);

    if (existingBeer.length > 0) {
      return {
        success: false,
        error: "A beer with this name already exists for this brewery",
      };
    }

    const [newBeer] = await db
      .insert(beer)
      .values({
        name: input.name,
        style: input.style,
        abv: String(input.abv),
        description: input.description,
        breweryId: input.breweryId,
      })
      .returning();

    return { success: true, beer: newBeer };
  } catch (error) {
    console.error("Error creating beer:", error);
    return { success: false, error: "Failed to create beer" };
  }
}

export async function getBeer(id: string) {
  const beerData = await db.query.beer.findFirst({
    with: {
      brewery: true,
    },
    where: eq(beer.id, id),
  });

  return beerData;
}
