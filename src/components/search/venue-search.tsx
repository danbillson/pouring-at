"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Venue } from "@/types/venue";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Hop, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function searchVenues(search: string) {
  if (!search) return [];
  const response = await fetch(`/api/venues?q=${encodeURIComponent(search)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  const data = await response.json();
  return data.venues as Venue[];
}

async function getVenue(id: string, type: "bar" | "brewery") {
  const response = await fetch(`/api/${type}s/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }
  const data = await response.json();
  return data[type] as Venue;
}

export function VenueSearch() {
  const router = useRouter();
  const { selectedVenue, setSelectedVenue, showVenueSelect } = useDashboard();
  const [open, setOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: venues = [] } = useQuery({
    queryKey: ["venues", debouncedSearch],
    queryFn: () => searchVenues(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  const { data: venue } = useQuery({
    queryKey: ["venue", selectedVenue?.type, selectedVenue?.id],
    queryFn: () =>
      selectedVenue ? getVenue(selectedVenue.id, selectedVenue.type) : null,
    enabled: !!selectedVenue,
  });

  const setSearchDebouncer = useAsyncDebouncer(
    (value: string) => {
      setDebouncedSearch(value);
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    return () => {
      setSearchDebouncer.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render if venue select should be hidden
  if (!showVenueSelect) return null;

  const handleVenueSelect = (venue: Venue | null) => {
    setSelectedVenue(venue);
    setOpen(false);

    if (!venue) {
      return;
    }

    const isChangingType = selectedVenue?.type !== venue.type;

    if (isChangingType) {
      router.push(`/dashboard/${venue.type}`);
    }

    router.refresh();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-none"
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-foreground text-background shrink-0 rounded-sm p-1">
              {selectedVenue?.type === "brewery" ? (
                <Hop className="size-4" />
              ) : (
                <Store className="size-4" />
              )}
            </div>
            <span className="truncate">
              {selectedVenue
                ? (venue?.name ??
                  venues.find((v) => v.id === selectedVenue.id)?.name ??
                  "Loading...")
                : "Select venue..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search venues..."
            onValueChange={(value) => {
              setSearchDebouncer.maybeExecute(value);
            }}
          />
          <CommandList>
            {venues.map((venue) => (
              <CommandItem
                key={`${venue.type}-${venue.id}`}
                value={venue.id}
                onSelect={() => {
                  handleVenueSelect(
                    selectedVenue?.id === venue.id ? null : venue
                  );
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {venue.type === "brewery" ? (
                      <Hop className="size-4" />
                    ) : (
                      <Store className="size-4" />
                    )}
                    <span>{venue.name}</span>
                  </div>
                  {venue.formattedAddress && (
                    <span className="text-muted-foreground ml-6 text-xs">
                      {venue.formattedAddress}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
