"use client";

import { BarMap } from "@/components/bar-map";
import { SearchForm } from "@/components/forms/search-form";
import { Card } from "@/components/ui/card";
import { useQueryState } from "nuqs";

export default function SearchPage() {
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
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="grid gap-8">
          <Card className="mx-auto w-full max-w-lg p-4">
            <SearchForm
              defaultValues={{
                location: location || "",
                brewery: brewery || "",
                style: style || "",
              }}
              onSubmit={handleSearch}
            />
          </Card>

          {location && (
            <div className="h-[600px] w-full">
              <BarMap
                location={location}
                style={style || undefined}
                brewery={brewery || undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
