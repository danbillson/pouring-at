"use client";

import { getBeerAction, searchBeersAction } from "@/actions/beer";
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
import type { Beer } from "@/db/schema";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SearchedBeer = {
  id: string;
  name: string;
  brewery?: {
    id: string;
    name: string;
    slug: string | null;
  } | null;
};

interface BeerSearchProps {
  value?: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
}

export function BeerSearch({ value, onChange, onCreateNew }: BeerSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedBeer[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [selectedBeerName, setSelectedBeerName] = useState<string | null>(null);
  const [isLoadingSelected, setIsLoadingSelected] = useState(false);

  useEffect(() => {
    if (value) {
      setIsLoadingSelected(true);
      setSelectedBeerName("Loading...");
      getBeerAction(value)
        .then((result) => {
          if (result.success && result.data) {
            setSelectedBeerName(result.data.name);
          } else {
            setSelectedBeerName("Error loading");
            console.error(result.error || "Failed to fetch selected beer");
          }
        })
        .catch((err) => {
          setSelectedBeerName("Error loading");
          console.error("Error in getBeerAction:", err);
        })
        .finally(() => {
          setIsLoadingSelected(false);
        });
    } else {
      setSelectedBeerName(null);
    }
  }, [value]);

  const performSearch = useAsyncDebouncer(
    async (query: string) => {
      if (!query) {
        setSearchResults([]);
        setIsLoadingSearch(false);
        return;
      }
      setIsLoadingSearch(true);
      try {
        const result = await searchBeersAction(query);
        if (result.success && result.data) {
          setSearchResults(result.data as SearchedBeer[]);
        } else {
          setSearchResults([]);
          console.error(result.error || "Failed to search beers");
          toast.error(result.error || "Beer search failed");
        }
      } catch (error) {
        setSearchResults([]);
        console.error("Error in searchBeersAction:", error);
        toast.error(
          error instanceof Error ? error.message : "Beer search failed"
        );
      } finally {
        setIsLoadingSearch(false);
      }
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    return () => {
      performSearch.cancel();
    };
  }, [performSearch]);

  const displayValue = value
    ? (selectedBeerName ??
      searchResults.find((beer) => beer.id === value)?.name ??
      (isLoadingSelected ? "Loading..." : "Select beer..."))
    : "Select beer...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoadingSelected}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search beers..."
            onValueChange={(value) => {
              setSearchQuery(value);
              performSearch.maybeExecute(value);
            }}
            value={searchQuery}
            disabled={isLoadingSearch}
          />
          <CommandList>
            {isLoadingSearch && (
              <CommandItem disabled>Searching...</CommandItem>
            )}
            {!isLoadingSearch && searchResults.length === 0 && searchQuery && (
              <CommandItem disabled>No beers found.</CommandItem>
            )}
            {!isLoadingSearch &&
              searchResults.map((beer) => (
                <CommandItem
                  key={beer.id}
                  value={beer.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setSelectedBeerName(beer.name);
                    setOpen(false);
                  }}
                >
                  {beer.brewery?.name && (
                    <span className="text-muted-foreground mr-2">
                      {beer.brewery.name}
                    </span>
                  )}
                  {beer.name}
                </CommandItem>
              ))}
            {onCreateNew && (
              <CommandItem
                onSelect={() => {
                  onCreateNew?.();
                  setOpen(false);
                }}
                className="text-muted-foreground mt-1 cursor-pointer border-t pt-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add a new beer...
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
