import { BarWithTaps, searchBars } from "@/actions/bar";
import { BarMapList } from "@/components/bars/bar-map-list";
import { SearchFilters } from "@/components/search/search-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { geocodeLocation } from "@/lib/maps/geocoding";
import { Terminal } from "lucide-react";

interface SearchPageProps {
  searchParams?: Promise<{
    location?: string;
    style?: string;
    brewery?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locationQuery = (await searchParams)?.location;
  const style = (await searchParams)?.style;
  const brewery = (await searchParams)?.brewery;

  let bars: BarWithTaps[] = [];
  let center = { lat: 51.5074, lng: -0.1278 };
  let initialError: string | null = null;

  if (locationQuery) {
    try {
      center = await geocodeLocation(locationQuery);
      bars = await searchBars({
        lat: center.lat,
        lng: center.lng,
        style: style,
        brewery: brewery,
      });
      console.log("bars", bars);
    } catch (error) {
      console.error("Search page error:", error);
      initialError =
        error instanceof Error
          ? error.message
          : "Failed to fetch search results.";
      bars = [];
    }
  }

  return (
    <div className="min-h-[calc(100vh-68px)]">
      <div className="container mx-auto py-8">
        <div className="grid gap-8">
          <SearchFilters />

          {initialError && (
            <Alert variant="destructive" className="mx-auto max-w-lg">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Search Error</AlertTitle>
              <AlertDescription>{initialError}</AlertDescription>
            </Alert>
          )}

          {locationQuery && !initialError ? (
            <BarMapList
              bars={bars}
              center={center}
              initialStyle={style}
              initialBrewery={brewery}
            />
          ) : !locationQuery ? (
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                Enter a location above to search for bars.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
