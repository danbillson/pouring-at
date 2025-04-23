import { AppSidebar } from "@/components/app-sidebar";
import { DashboardProvider } from "@/components/dashboard/dashboard-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { bar, brewery } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Venue } from "@/lib/venue";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const VENUE_COOKIE_NAME = "last_visited_venue";

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

  // Get available venues based on role
  const [bars, breweries] = await Promise.all([
    db.query.bar.findMany({
      where: isAdmin
        ? undefined
        : eq(bar.organizationId, session.session.activeOrganizationId ?? ""),
    }),
    db.query.brewery.findMany({
      where: isAdmin
        ? undefined
        : eq(
            brewery.organizationId,
            session.session.activeOrganizationId ?? ""
          ),
    }),
  ]);

  // Transform to venues
  const availableVenues = [
    ...bars.map((b) => ({ type: "bar" as const, ...b })),
    ...breweries.map((b) => ({ type: "brewery" as const, ...b })),
  ] as unknown as Venue[];

  let defaultVenue: Venue | undefined;
  const storedVenue = cookieStore.get(VENUE_COOKIE_NAME)?.value;

  if (storedVenue) {
    try {
      const { id, type } = JSON.parse(storedVenue);
      defaultVenue = availableVenues.find(
        (v) => v.id === id && v.type === type
      );
    } catch {
      // Invalid stored venue, ignore
    }
  }

  // Auto-select if user has only one venue and isn't admin
  if (!defaultVenue && availableVenues.length === 1 && !isAdmin) {
    defaultVenue = availableVenues[0];
  }

  return (
    <DashboardProvider
      defaultVenue={defaultVenue}
      isAdmin={isAdmin}
      availableVenues={availableVenues}
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
