"use client";

import { BeerStyleSelect } from "@/components/forms/beer-style-select";
import { BrewerySelect } from "@/components/search/brewery-select";
import { searchFiltersParsers } from "@/lib/search-params";
import { SlidersHorizontal } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

export function SearchFilters() {
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(searchFiltersParsers, {
    startTransition,
    shallow: false,
    history: "push",
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4">
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="xs:grid-cols-[16px_1fr_1fr] grid w-full max-w-[400px] items-center gap-4">
        <SlidersHorizontal className="xs:block hidden h-4 w-4" />
        <BrewerySelect
          value={filters.brewery || ""}
          onChange={(value) => setFilters({ brewery: value || null })}
        />
        <BeerStyleSelect
          value={filters.style}
          onChange={(value) => setFilters({ style: value || null })}
        />
      </div>
    </div>
  );
}
