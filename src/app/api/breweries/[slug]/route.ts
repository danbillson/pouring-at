import { db } from "@/db";
import { brewery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const [result] = await db
    .select({
      id: brewery.id,
      name: brewery.name,
      slug: brewery.slug,
    })
    .from(brewery)
    .where(eq(brewery.slug, slug))
    .limit(1);

  if (!result) {
    return NextResponse.json({ error: "Brewery not found" }, { status: 404 });
  }

  return NextResponse.json({ brewery: result });
}
