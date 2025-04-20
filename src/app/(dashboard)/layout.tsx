import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sidebar flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background m-2 w-full rounded-lg px-4">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
