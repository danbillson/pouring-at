import { db } from "@/db";
import { bar, member as memberSchema } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function hasAccessToBar() {
  const cookieStore = await cookies();
  const barId = cookieStore.get("last_visited_bar")?.value;

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
