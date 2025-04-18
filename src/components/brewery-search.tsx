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
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface BrewerySearchProps {
  value?: string;
  name?: string;
  onChange: (value: { id?: string; name: string }) => void;
  onCreateNew?: () => void;
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

export function BrewerySearch({
  value,
  name,
  onChange,
  onCreateNew,
}: BrewerySearchProps) {
  const [open, setOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(name || "");

  const { data: breweries = [] } = useQuery({
    queryKey: ["breweries", debouncedSearch],
    queryFn: () => searchBreweries(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const setSearchDebouncer = useAsyncDebouncer(
    (value: string) => {
      setDebouncedSearch(value);
      onChange({ name: value });
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
          className="w-full justify-between"
        >
          {value
            ? (breweries.find((brewery) => brewery.id === value)?.name ??
              name ??
              debouncedSearch)
            : "Select brewery..."}
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

          <CommandList>
            <CommandEmpty>
              {!debouncedSearch ? (
                <span>Enter a brewery name to search for.</span>
              ) : (
                <div className="grid place-items-center gap-2 p-4">
                  <span>No breweries found.</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      onCreateNew?.();
                    }}
                  >
                    Create new brewery
                  </Button>
                </div>
              )}
            </CommandEmpty>
            {breweries.map((brewery) => (
              <CommandItem
                key={brewery.id}
                value={brewery.id}
                onSelect={(currentValue) => {
                  const selected =
                    currentValue === value
                      ? { name: debouncedSearch }
                      : { id: currentValue, name: brewery.name };
                  onChange(selected);
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
