"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { beerStyles } from "@/lib/constants/beer-style";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

// Flatten the beerStyles object into an array of strings
const allBeerStyles = Object.values(beerStyles).flat();

interface BeerStyleSelectProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function BeerStyleSelect({
  value,
  onChange,
  placeholder = "All styles",
  className,
}: BeerStyleSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground hover:text-muted-foreground",
            className
          )}
        >
          {value ? allBeerStyles.find((style) => style === value) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search style..." />
          <CommandList>
            <CommandEmpty>No style found.</CommandEmpty>
            <CommandItem
              value="--clear--"
              onSelect={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !value ? "opacity-100" : "opacity-0"
                )}
              />
              {placeholder}
            </CommandItem>
            {Object.entries(beerStyles).map(([category, styles]) => (
              <CommandGroup
                key={category}
                heading={category.split("_").join(" ")}
              >
                {styles.map((style) => (
                  <CommandItem
                    key={style}
                    value={style}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === style ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {style}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
