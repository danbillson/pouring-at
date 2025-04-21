import { AppSidebar } from "@/components/app-sidebar";
import { DashboardProvider } from "@/components/dashboard/dashboard-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { bar } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const BAR_COOKIE_NAME = "last_visited_bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";

  // Get available bars based on role
  const availableBars = await db.query.bar.findMany({
    where: isAdmin
      ? undefined
      : eq(bar.organizationId, session.session.activeOrganizationId ?? ""),
  });

  let defaultBarId = cookieStore.get(BAR_COOKIE_NAME)?.value;

  // Validate the stored bar ID is still accessible to user
  if (defaultBarId && !availableBars.some((b) => b.id === defaultBarId)) {
    defaultBarId = undefined;
  }

  // Auto-select if user has only one bar and isn't admin
  if (!defaultBarId && availableBars.length === 1 && !isAdmin) {
    defaultBarId = availableBars[0].id;
  }

  return (
    <DashboardProvider
      defaultBarId={defaultBarId}
      isAdmin={isAdmin}
      availableBars={availableBars}
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background m-2 w-full rounded-lg px-4">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
}
