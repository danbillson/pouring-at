import { db } from "@/db";
import { brewery } from "@/db/schema";
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
  const result = await db.query.brewery.findFirst({
    where: eq(brewery.id, id),
  });

  if (!result) {
    return NextResponse.json({ error: "Brewery not found" }, { status: 404 });
  }

  return NextResponse.json({ brewery: result });
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userBrewery = await hasAccessToBrewery();

  if (!userBrewery) {
    return new NextResponse("Not found", { status: 404 });
  }

  const data = await request.json();

  await db
    .update(brewery)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(brewery.id, userBrewery.id));

  return NextResponse.json({ success: true });
}
