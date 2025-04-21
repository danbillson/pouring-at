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
  ...sharedItems,
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
  const { selectedVenue } = useDashboard();

  const items = selectedVenue?.type === "bar" ? barItems : breweryItems;

  return (
    <Sidebar>
      <SidebarHeader>
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
