"use client";

import { getBreweryAction, searchBreweriesAction } from "@/actions/brewery";
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
import { cn } from "@/lib/utils";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface BrewerySearchProps {
  value?: string;
  name?: string;
  onChange: (value: string | null) => void;
}

interface SearchedBrewery {
  id: string;
  name: string;
  slug: string | null;
}

// The BrewerySelect component is used to search for breweries by slug without
// the option to create a new brewery.
export function BrewerySelect({ value, name, onChange }: BrewerySearchProps) {
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
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground hover:text-muted-foreground"
          )}
          disabled={isPending}
        >
          {value
            ? (selectedBrewery?.name ??
              searchResults.find((brewery) => brewery.id === value)?.name ??
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
          <CommandList>
            <CommandEmpty>No breweries found.</CommandEmpty>
            {searchResults.map((brewery) => (
              <CommandItem
                key={brewery.id}
                value={brewery.id}
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
