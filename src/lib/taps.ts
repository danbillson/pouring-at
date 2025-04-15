import { db } from "@/db";
import { beer, brewery, tap } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

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
