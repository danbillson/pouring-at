import { Button } from "@/components/ui/button";
import { getTaps } from "@/lib/taps";

export async function TapList({ barId }: { barId: string }) {
  const taps = await getTaps(barId);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Tap list</h2>
      {taps.length === 0 ? (
        <div className="bg-muted grid place-items-center rounded-md px-6 py-12">
          <p className="text-muted-foreground mb-6">
            No beers currently on tap
          </p>
          <Button>Add a beer</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {taps.map((tap) => (
            <div key={tap.id} className="flex flex-col">
              <h3 className="font-medium">{tap.beer.name}</h3>
              <div className="text-muted-foreground text-sm">
                <p>{tap.brewery.name}</p>
                <p>
                  {tap.beer.style}
                  {tap.beer.abv && ` • ${tap.beer.abv}%`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
