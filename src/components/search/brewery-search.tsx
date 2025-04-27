"use client";

import { getBreweryAction, searchBreweriesAction } from "@/actions/brewery";
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
import { ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface BrewerySearchProps {
  value?: string;
  name?: string;
  onChange: (value: { id?: string; name: string }) => void;
  onCreateNew?: () => void;
}

interface SearchedBrewery {
  id: string;
  name: string;
  slug: string | null;
}

// The BrewerySearch component is used to search for breweries by name with
// the option to create a new brewery.
export function BrewerySearch({
  value,
  name,
  onChange,
  onCreateNew,
}: BrewerySearchProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<SearchedBrewery[]>([]);
  const [selectedBrewery, setSelectedBrewery] =
    useState<SearchedBrewery | null>(null);

  // Load initial brewery if value is provided
  useEffect(() => {
    if (value) {
      startTransition(async () => {
        const result = await getBreweryAction(value);
        if (result.success && result.data) {
          const { id, name, slug } = result.data;
          setSelectedBrewery({ id, name, slug });
        }
      });
    }
  }, [value]);

  const runSearch = async (query: string) => {
    const result = await searchBreweriesAction(query);
    if (result.success && result.data) {
      setSearchResults(
        result.data.map(({ id, name, slug }) => ({ id, name, slug }))
      );
    } else {
      setSearchResults([]);
    }
  };

  const setSearchDebouncer = useAsyncDebouncer(
    async (value: string) => {
      startTransition(() => {
        runSearch(value);
        onChange({ name: value });
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isPending}
        >
          {value
            ? (selectedBrewery?.name ??
              searchResults.find((brewery) => brewery.id === value)?.name ??
              name ??
              "Loading...")
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
            {searchResults.map((brewery) => (
              <CommandItem
                key={brewery.id}
                value={brewery.id}
                onSelect={(currentValue) => {
                  const selected =
                    currentValue === value
                      ? { name: brewery.name }
                      : { id: currentValue, name: brewery.name };
                  onChange(selected);
                  setOpen(false);
                }}
              >
                {brewery.name}
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                onCreateNew?.();
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Add a new brewery
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
