"use client";

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
import type { Beer } from "@/lib/beers";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface BeerSearchProps {
  value?: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
}

async function searchBeers(search: string) {
  if (!search) return [];
  const response = await fetch(
    `/api/beers/search?q=${encodeURIComponent(search)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch beers");
  }
  const data = await response.json();
  return data.beers as Beer[];
}

async function getBeer(id: string) {
  const response = await fetch(`/api/beers/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch beer");
  }
  const data = await response.json();
  return data.beer as Beer;
}

export function BeerSearch({ value, onChange, onCreateNew }: BeerSearchProps) {
  const [open, setOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: beers = [] } = useQuery({
    queryKey: ["beers", debouncedSearch],
    queryFn: () => searchBeers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const { data: selectedBeer } = useQuery({
    queryKey: ["beer", value],
    queryFn: () => getBeer(value!),
    enabled: !!value,
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? (selectedBeer?.name ??
              beers.find((beer) => beer.id === value)?.name ??
              "Loading...")
            : "Select beer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search beers..."
            onValueChange={(value) => {
              setSearchDebouncer.maybeExecute(value);
            }}
          />
          <CommandList>
            {beers.map((beer) => (
              <CommandItem
                key={beer.id}
                value={beer.id}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {beer.brewery?.name && (
                  <span className="text-muted-foreground">
                    {beer.brewery.name}
                  </span>
                )}
                {beer.name}
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                onCreateNew?.();
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Add a new beer
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
