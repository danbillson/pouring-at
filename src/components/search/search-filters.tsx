"use client";

import { BrewerySelect } from "@/components/search/brewery-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { beerStyles } from "@/lib/constants/beer-style";
import { SlidersHorizontal } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useTransition } from "react";

const filtersParsers = {
  style: parseAsString.withDefault(""),
  brewery: parseAsString.withDefault(""),
};

export function SearchFilters() {
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(filtersParsers, {
    startTransition,
    history: "push",
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4">
      <h1 className="text-2xl font-bold">Search</h1>
      {isPending && (
        <span className="text-muted-foreground text-sm">Updating...</span>
      )}
      <div className="xs:grid-cols-[16px_1fr_1fr] grid w-full max-w-[400px] items-center gap-4">
        <SlidersHorizontal className="xs:block hidden h-4 w-4" />
        <BrewerySelect
          value={filters.brewery}
          onChange={(value) => setFilters({ brewery: value || "" })}
        />
        <Select
          onValueChange={(value) => setFilters({ style: value || "" })}
          value={filters.style}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Beer style" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(beerStyles).map(([category, styles]) => (
              <SelectGroup key={category}>
                <SelectLabel>{category.split("_").join(" ")}</SelectLabel>
                {styles.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
