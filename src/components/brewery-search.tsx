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
import type { Brewery } from "@/lib/breweries";
import { searchBreweries } from "@/lib/breweries";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface BrewerySearchProps {
  value?: string;
  name?: string;
  onChange: (value: { id?: string; name: string }) => void;
  onCreateNew?: () => void;
}

export function BrewerySearch({
  value,
  name,
  onChange,
  onCreateNew,
}: BrewerySearchProps) {
  const [open, setOpen] = useState(false);
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [search, setSearch] = useState(name || "");

  useEffect(() => {
    if (search.length > 0) {
      const getBreweries = async () => {
        const results = await searchBreweries(search);
        setBreweries(results);
      };
      getBreweries();
    } else {
      setBreweries([]);
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
            ? (breweries.find((brewery) => brewery.id === value)?.name ??
              name ??
              search)
            : "Select brewery..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search breweries..."
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              onChange({ name: value });
            }}
          />

          <CommandEmpty>
            {!search ? (
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
          <CommandGroup>
            {breweries.map((brewery) => (
              <CommandItem
                key={brewery.id}
                value={brewery.id}
                onSelect={(currentValue) => {
                  const selected =
                    currentValue === value
                      ? { name: search }
                      : { id: currentValue, name: brewery.name };
                  onChange(selected);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === brewery.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {brewery.name}
                {brewery.formattedAddress && (
                  <span className="text-muted-foreground ml-2">
                    • {brewery.formattedAddress}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
