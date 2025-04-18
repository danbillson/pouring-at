import { CreateTapForm } from "@/components/create-tap-form";
import { getTaps } from "@/lib/taps";

export async function TapList({ barId }: { barId: string }) {
  const taps = await getTaps(barId);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tap list</h2>
        <CreateTapForm barId={barId} />
      </div>
      {taps.length === 0 ? (
        <div className="bg-muted grid place-items-center rounded-md px-6 py-12">
          <p className="text-muted-foreground mb-6">
            No beers currently on tap
          </p>
          <CreateTapForm barId={barId} />
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
