import { db } from "@/db";
import { brewery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await db.query.brewery.findFirst({
    where: eq(brewery.slug, slug),
  });

  if (!result) {
    return NextResponse.json({ error: "Brewery not found" }, { status: 404 });
  }

  return NextResponse.json({ brewery: result });
}
