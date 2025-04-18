"use client";

import { SearchForm } from "@/components/forms/search-form";
import { Card } from "@/components/ui/card";
import { Map } from "@vis.gl/react-google-maps";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

const defaultCenter = { lat: 51.5074, lng: -0.1278 }; // London

export default function SearchPage() {
  const [location, setLocation] = useQueryState("location");
  const [style, setStyle] = useQueryState("style");
  const [brewery, setBrewery] = useQueryState("brewery");
  const [center, setCenter] = useQueryState("center", {
    defaultValue: `${defaultCenter.lat},${defaultCenter.lng}`,
  });

  const mapCenter = useMemo(() => {
    if (!center) return defaultCenter;
    const [lat, lng] = center.split(",").map(Number);
    return { lat, lng };
  }, [center]);

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
              <Map
                defaultZoom={13}
                center={mapCenter}
                gestureHandling={"greedy"}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
