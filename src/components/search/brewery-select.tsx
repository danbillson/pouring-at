"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Brewery } from "@/lib/breweries";
import { cn } from "@/lib/utils";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface BrewerySearchProps {
  value?: string;
  name?: string;
  onChange: (value: string) => void;
}

async function searchBreweries(search: string) {
  if (!search) return [];
  const response = await fetch(
    `/api/breweries/search?q=${encodeURIComponent(search)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch breweries");
  }
  const data = await response.json();
  return data.breweries as Brewery[];
}

async function getBrewery(slug: string) {
  const response = await fetch(`/api/breweries/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch brewery");
  }
  const data = await response.json();
  return data.brewery as Brewery;
}

// The BrewerySelect component is used to search for breweries by slug without
// the option to create a new brewery.
export function BrewerySelect({ value, name, onChange }: BrewerySearchProps) {
  const [open, setOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(name || "");

  const { data: breweries = [] } = useQuery({
    queryKey: ["breweries", debouncedSearch],
    queryFn: () => searchBreweries(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const { data: selectedBrewery } = useQuery({
    queryKey: ["brewery", value],
    queryFn: () => getBrewery(value!),
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
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          {value
            ? (selectedBrewery?.name ??
              breweries.find((brewery) => brewery.slug === value)?.name ??
              name ??
              "Loading...")
            : "Brewery"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search breweries..."
            onValueChange={(value) => {
              setSearchDebouncer.maybeExecute(value);
            }}
          />
          <CommandEmpty>No breweries found.</CommandEmpty>
          <CommandList>
            {breweries.map((brewery) => (
              <CommandItem
                key={brewery.slug}
                value={brewery.slug}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                {brewery.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
