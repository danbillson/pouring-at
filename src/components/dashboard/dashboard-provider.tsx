"use client";

import type { Venue, VenueType } from "@/db/schema";
import { createContext, useCallback, useContext, useState } from "react";

const VENUE_COOKIE_NAME = "last_visited_venue";
const VENUE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

type DashboardContextType = {
  selectedVenue: { id: string; type: VenueType } | null;
  setSelectedVenue: (venue: Venue | null) => void;
  showVenueSelect: boolean;
  isStandardUser: boolean;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

interface DashboardProviderProps {
  defaultVenue?: Venue | null;
  isSuperadmin?: boolean;
  availableVenues: Venue[];
  children: React.ReactNode;
}

export function DashboardProvider({
  defaultVenue,
  isSuperadmin = false,
  availableVenues = [],
  children,
}: DashboardProviderProps) {
  const [selectedVenue, setSelectedVenueState] = useState(defaultVenue ?? null);

  const isStandardUser = !isSuperadmin && availableVenues.length === 0;
  // Only show venue select if user is superadmin OR has access to multiple venues
  const showVenueSelect = isSuperadmin || availableVenues.length > 1;

  const setSelectedVenue = useCallback((venue: Venue | null) => {
    setSelectedVenueState(venue);

    if (venue) {
      document.cookie = `${VENUE_COOKIE_NAME}=${JSON.stringify({
        id: venue.id,
        type: venue.type,
      })}; path=/; max-age=${VENUE_COOKIE_MAX_AGE}`;
    } else {
      document.cookie = `${VENUE_COOKIE_NAME}=; path=/; max-age=0`;
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        selectedVenue,
        setSelectedVenue,
        showVenueSelect,
        isStandardUser,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
