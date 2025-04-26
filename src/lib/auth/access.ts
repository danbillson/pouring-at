import { db } from "@/db";
import { bar, brewery, member as memberSchema } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function hasAccessToBar() {
  const cookieStore = await cookies();
  const venue = cookieStore.get("last_visited_venue")?.value;
  const barId = extractId(venue);

  if (!barId) {
    redirect("/dashboard");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userMember = await db.query.member.findFirst({
    where: eq(memberSchema.userId, session.user.id),
  });

  if (!userMember && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const userBar = await db.query.bar.findFirst({
    where:
      session.user.role === "admin"
        ? eq(bar.id, barId)
        : and(
            eq(bar.organizationId, userMember?.organizationId ?? ""),
            eq(bar.id, barId)
          ),
  });

  if (!userBar) {
    redirect("/dashboard");
  }

  return userBar;
}

export async function hasAccessToBrewery() {
  const cookieStore = await cookies();
  const venue = cookieStore.get("last_visited_venue")?.value;
  const breweryId = extractId(venue);

  if (!breweryId) {
    redirect("/dashboard");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userMember = await db.query.member.findFirst({
    where: eq(memberSchema.userId, session.user.id),
  });

  if (!userMember && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const userBrewery = await db.query.brewery.findFirst({
    where:
      session.user.role === "admin"
        ? eq(brewery.id, breweryId)
        : and(
            eq(brewery.organizationId, userMember?.organizationId ?? ""),
            eq(brewery.id, breweryId)
          ),
  });

  if (!userBrewery) {
    redirect("/dashboard");
  }

  return userBrewery;
}

function extractId(cookieValue: string | undefined) {
  let id;
  try {
    id = JSON.parse(cookieValue ?? "{}").id;
  } catch {
    id = undefined;
  }

  return id;
}
