import { db } from "@/db";
import { bar } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db.query.bar.findFirst({
    where: eq(bar.id, id),
  });

  if (!result) {
    return NextResponse.json({ error: "Bar not found" }, { status: 404 });
  }

  return NextResponse.json({ bar: result });
}
