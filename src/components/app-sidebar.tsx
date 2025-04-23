"use client";

import { VenueSearch } from "@/components/search/venue-search";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { VenueType } from "@/lib/venue";
import { Beer, Hop, LayoutPanelLeft, Store, User } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "./dashboard/dashboard-provider";

// Menu items.
const sharedItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: LayoutPanelLeft,
  },
];

const barItems = [
  ...sharedItems,
  {
    title: "Bar",
    url: "/dashboard/bar",
    icon: Store,
  },
  {
    title: "Taps",
    url: "/dashboard/taps",
    icon: Beer,
  },
];

const breweryItems = [
  ...sharedItems,
  {
    title: "Brewery",
    url: "/dashboard/brewery",
    icon: Hop,
  },
  {
    title: "Beers",
    url: "/dashboard/beers",
    icon: Beer,
  },
];

export function AppSidebar() {
  const { selectedVenue, isStandardUser } = useDashboard();

  const items = getSidebarItems(isStandardUser, selectedVenue);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="hidden p-2 font-bold sm:block">
          pouring<span className="text-amber-500">.</span>at
        </Link>
        <VenueSearch />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Link href="/dashboard/profile">
            <User />
            <span>Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

function getSidebarItems(
  isStandardUser: boolean,
  selectedVenue: { id: string; type: VenueType } | null
) {
  if (isStandardUser) {
    return sharedItems;
  }

  return selectedVenue?.type === "bar" ? barItems : breweryItems;
}
