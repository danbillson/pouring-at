"use server";

import { db } from "@/db";
import { beer, brewery, tap } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTaps(barId: string) {
  return db
    .select({
      id: tap.id,
      tappedOn: tap.tappedOn,
      beer: {
        id: beer.id,
        name: beer.name,
        style: beer.style,
        abv: beer.abv,
      },
      brewery: {
        id: brewery.id,
        name: brewery.name,
      },
    })
    .from(tap)
    .innerJoin(beer, eq(tap.beerId, beer.id))
    .innerJoin(brewery, eq(beer.breweryId, brewery.id))
    .where(and(eq(tap.barId, barId), isNull(tap.tappedOff)));
}

export async function createTap(barId: string, beerId: string) {
  try {
    await db.insert(tap).values({
      barId,
      beerId,
      tappedOn: new Date(),
    });

    revalidatePath(`/bars/${barId}`, "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tap:", error);
    return { success: false, error: "Failed to add beer to tap list" };
  }
}
