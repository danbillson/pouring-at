"use client";

import { BarMapList } from "@/components/bars/bar-map-list";
import { BrewerySelect } from "@/components/search/brewery-select";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { beerStyles } from "@/lib/constants/beer-style";
import { SlidersHorizontal } from "lucide-react";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

function SearchContent() {
  const [location] = useQueryState("location");
  const [style, setStyle] = useQueryState("style");
  const [brewery, setBrewery] = useQueryState("brewery");

  const handleBreweryChange = async (newBreweryValue: string | null) => {
    await setBrewery(newBreweryValue || null);
  };

  const handleStyleChange = async (newStyleValue: string) => {
    await setStyle(newStyleValue || null);
  };

  return (
    <div className="grid gap-8">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4">
        <h1 className="text-2xl font-bold">Search</h1>
        <div className="xs:grid-cols-[16px_1fr_1fr] grid w-full max-w-[400px] items-center gap-4">
          <SlidersHorizontal className="xs:block hidden h-4 w-4" />

          <BrewerySelect value={brewery || ""} onChange={handleBreweryChange} />

          <Select onValueChange={handleStyleChange} value={style || ""}>
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

      {location && (
        <BarMapList
          location={location}
          style={style || undefined}
          brewery={brewery || undefined}
        />
      )}
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="grid gap-8">
      <div className="mx-auto">
        <Card className="w-[400px] p-4">
          <Skeleton className="h-10 w-full" />
          <div className="mt-4 grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>

      <div className="grid h-full lg:grid-cols-[400px_1fr]">
        <div className="space-y-4 pr-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-[calc(100vh-68px)]">
      <div className="container mx-auto py-8">
        <Suspense fallback={<SearchFallback />}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
