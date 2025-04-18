"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Beer } from "@/lib/beers";
import { searchBeers } from "@/lib/beers";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface BeerSearchProps {
  value?: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
}

export function BeerSearch({ value, onChange, onCreateNew }: BeerSearchProps) {
  const [open, setOpen] = useState(false);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length > 0) {
      const getBeers = async () => {
        const results = await searchBeers(search);
        setBeers(results);
      };
      getBeers();
    }
  }, [search]);

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
            ? (beers.find((beer) => beer.id === value)?.name ?? value)
            : "Select beer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search beers..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandEmpty>
            {!search ? (
              <span>Enter a beer name to search for.</span>
            ) : (
              <div className="grid place-items-center gap-2">
                <span>No beers found.</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    onCreateNew?.();
                    setOpen(false);
                  }}
                >
                  Add a new beer
                </Button>
              </div>
            )}
          </CommandEmpty>
          <CommandGroup>
            {beers.map((beer) => (
              <CommandItem
                key={beer.id}
                value={beer.id}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === beer.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {beer.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
