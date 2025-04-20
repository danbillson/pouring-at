import { AddTap } from "@/components/add-tap";
import { getTaps } from "@/lib/taps";
import { Beer } from "lucide-react";

export async function TapList({ barId }: { barId: string }) {
  const taps = await getTaps(barId);

  return (
    <div className="mt-8">
      <div className="bg-background mb-4 flex items-center justify-between rounded-lg p-4">
        <h2 className="text-2xl font-bold">Tap list</h2>
        <AddTap barId={barId} />
      </div>
      {taps.length === 0 ? (
        <div className="bg-muted grid place-items-center rounded-md px-6 py-12">
          <p className="text-muted-foreground mb-6">
            No beers currently on tap
          </p>
          <AddTap barId={barId} />
        </div>
      ) : (
        <ul className="bg-background space-y-4 rounded-lg p-4">
          {taps.map((tap) => (
            <li key={tap.id} className="flex items-center gap-2">
              <div className="bg-muted flex size-10 items-center justify-center rounded-md">
                <Beer className="size-4" />
              </div>

              <div className="flex flex-col">
                <h3 className="font-medium">
                  <span className="text-muted-foreground">
                    {tap.brewery.name}{" "}
                  </span>
                  {tap.beer.name}
                </h3>
                <div className="text-muted-foreground text-sm">
                  <p>
                    {tap.beer.style}
                    {tap.beer.abv && ` • ${tap.beer.abv}%`}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
