import { db } from "@/db";
import { beer } from "@/db/schema";
import { hasAccessToBrewery } from "@/lib/access";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db.query.beer.findFirst({
    where: eq(beer.id, id),
    with: {
      brewery: true,
    },
  });

  if (!result) {
    return NextResponse.json({ error: "Beer not found" }, { status: 404 });
  }

  return NextResponse.json({ beer: result });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const existingBeer = await db.query.beer.findFirst({
    where: eq(beer.id, id),
  });

  if (!existingBeer) {
    return NextResponse.json({ error: "Beer not found" }, { status: 404 });
  }

  const userBrewery = await hasAccessToBrewery();

  if (!userBrewery || userBrewery.id !== existingBeer.breweryId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await request.json();

  await db
    .update(beer)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(beer.id, id));

  return NextResponse.json({ success: true });
}
