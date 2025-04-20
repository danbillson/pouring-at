import { db } from "@/db";
import { beer } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
