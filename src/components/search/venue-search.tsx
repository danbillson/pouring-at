"use client";

import { getBar } from "@/actions/bar";
import { getBreweryAction } from "@/actions/brewery";
import { searchVenuesAction, type VenueSearchResult } from "@/actions/search";
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
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { ChevronsUpDown, Hop, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function VenueSearch() {
  const router = useRouter();
  const { selectedVenue, setSelectedVenue, showVenueSelect } = useDashboard();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<VenueSearchResult[]>([]);
  const [initialVenue, setInitialVenue] = useState<VenueSearchResult | null>(
    null
  );

  // Load initial venue if selected
  useEffect(() => {
    if (selectedVenue) {
      startTransition(async () => {
        if (selectedVenue.type === "bar") {
          const result = await getBar(selectedVenue.id);
          if (result) {
            setInitialVenue({ ...result, type: "bar" });
          }
        } else {
          const result = await getBreweryAction(selectedVenue.id);
          if (result.success && result.data) {
            setInitialVenue({ ...result.data, type: "brewery" });
          }
        }
      });
    }
  }, [selectedVenue]);

  const runSearch = async (query: string) => {
    if (query.length < 2) return;

    const result = await searchVenuesAction(query);
    if (result.success && result.data) {
      setSearchResults(result.data);
    } else {
      setSearchResults([]);
    }
  };

  const setSearchDebouncer = useAsyncDebouncer(
    async (value: string) => {
      startTransition(() => {
        runSearch(value);
      });
    },
    { wait: 300 }
  );

  useEffect(() => {
    return () => {
      setSearchDebouncer.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render if venue select should be hidden
  if (!showVenueSelect) return null;

  const handleVenueSelect = (venue: VenueSearchResult | null) => {
    setSelectedVenue(venue);
    setOpen(false);

    if (!venue) {
      return;
    }

    const isChangingType = selectedVenue?.type !== venue.type;

    if (isChangingType) {
      router.push(`/dashboard`);
    }

    router.refresh();
  };

  const displayName = selectedVenue
    ? (searchResults.find((v) => v.id === selectedVenue.id)?.name ??
      initialVenue?.name ??
      "Loading...")
    : "Select venue...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-none"
          disabled={isPending}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-foreground text-background shrink-0 rounded-sm p-1">
              {selectedVenue?.type === "brewery" ? (
                <Hop className="size-4" />
              ) : (
                <Store className="size-4" />
              )}
            </div>
            <span className="truncate">{displayName}</span>
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
            {searchResults.map((venue) => (
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
