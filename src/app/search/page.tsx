"use client";

import { BarMapList } from "@/components/bars/bar-map-list";
import { SearchForm } from "@/components/forms/search-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

function SearchContent() {
  const [location, setLocation] = useQueryState("location");
  const [style, setStyle] = useQueryState("style");
  const [brewery, setBrewery] = useQueryState("brewery");

  const handleSearch = async (values: {
    location: string;
    brewery?: string;
    style?: string;
  }) => {
    await Promise.all([
      setLocation(values.location),
      setStyle(values.style || null),
      setBrewery(values.brewery || null),
    ]);
  };

  return (
    <div className="grid gap-8">
      <div className="mx-auto">
        <SearchForm
          defaultValues={{
            location: location || "",
            brewery: brewery || "",
            style: style || "",
          }}
          onSubmit={handleSearch}
        />
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
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <Suspense fallback={<SearchFallback />}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
