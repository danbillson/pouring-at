import { db } from "@/db";
import { bar } from "@/db/schema";
import { hasAccessToBar } from "@/lib/access";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
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

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userBar = await hasAccessToBar();

  if (!userBar) {
    return new NextResponse("Not found", { status: 404 });
  }

  const data = await request.json();

  await db
    .update(bar)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(bar.id, userBar.id));

  return NextResponse.json({ success: true });
}
