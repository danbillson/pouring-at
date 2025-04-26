import { db } from "@/db";
import { bar } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { and, eq, ilike } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get the current session and check permissions
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 1) {
    return NextResponse.json({ bars: [] });
  }

  const isAdmin = session.user.role === "admin";

  // Split search into words and create conditions for each word
  const searchTerms = search.split(" ").filter(Boolean);
  const nameConditions = searchTerms.map((term) =>
    ilike(bar.name, `%${term}%`)
  );
  const searchConditions = [and(...nameConditions)];

  // If not admin and has active organization, add organization filter
  if (!isAdmin && session.session.activeOrganizationId) {
    searchConditions.push(
      eq(bar.organizationId, session.session.activeOrganizationId)
    );
  }
  const bars = await db.query.bar.findMany({
    where: and(...searchConditions),
    limit: 10,
  });

  return NextResponse.json({ bars });
}
