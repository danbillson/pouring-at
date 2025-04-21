"use client";

import { createContext, useCallback, useContext, useState } from "react";

const BAR_COOKIE_NAME = "last_visited_bar";
const BAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

type DashboardContextType = {
  selectedBarId: string | null;
  setSelectedBar: (barId: string | null) => void;
  showBarSelect: boolean;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

interface DashboardProviderProps {
  defaultBarId?: string | null;
  isAdmin?: boolean;
  availableBars: Array<{ id: string; name: string }>;
  children: React.ReactNode;
}

export function DashboardProvider({
  defaultBarId,
  isAdmin = false,
  availableBars = [],
  children,
}: DashboardProviderProps) {
  const [selectedBarId, setSelectedBarId] = useState(defaultBarId ?? null);

  // Only show bar select if user is admin OR has access to multiple bars
  const showBarSelect = isAdmin || availableBars.length > 1;

  const setSelectedBar = useCallback((barId: string | null) => {
    setSelectedBarId(barId);

    if (barId) {
      document.cookie = `${BAR_COOKIE_NAME}=${barId}; path=/; max-age=${BAR_COOKIE_MAX_AGE}`;
    } else {
      document.cookie = `${BAR_COOKIE_NAME}=; path=/; max-age=0`;
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        selectedBarId,
        setSelectedBar,
        showBarSelect,
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
