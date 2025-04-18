import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const [result] = await db
    .select({
      id: beer.id,
      name: beer.name,
      brewery: {
        id: brewery.id,
        name: brewery.name,
      },
    })
    .from(beer)
    .leftJoin(brewery, eq(beer.breweryId, brewery.id))
    .where(eq(beer.id, id))
    .limit(1);

  if (!result) {
    return NextResponse.json({ error: "Beer not found" }, { status: 404 });
  }

  return NextResponse.json({ beer: result });
}
