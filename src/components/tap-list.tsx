import { AddTap } from "@/components/add-tap";
import { auth } from "@/lib/auth";
import { getTaps } from "@/lib/taps";
import { Beer } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export async function TapList({ barId }: { barId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const taps = await getTaps(barId);

  return (
    <div className="mt-8">
      <div className="bg-background mb-4 flex items-center justify-between rounded-lg p-4">
        <h2 className="text-2xl font-bold">Tap list</h2>
        {session?.user && <AddTap barId={barId} />}
      </div>
      {taps.length === 0 ? (
        <div className="bg-muted grid place-items-center rounded-md px-6 py-12">
          <p className="text-muted-foreground mb-6">
            No beers currently on tap
          </p>
          {session?.user && <AddTap barId={barId} />}
        </div>
      ) : (
        <ul className="bg-background rounded-lg p-4">
          {taps.map((tap) => (
            <li key={tap.id}>
              <Link
                href={`/beers/${tap.beer.id}`}
                className="hover:bg-muted flex items-center gap-2 rounded-md p-2"
              >
                <div className="bg-muted flex size-10 items-center justify-center rounded-md">
                  <Beer className="size-4" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-medium">
                    {tap.beer.name}{" "}
                    <span className="text-muted-foreground">
                      {tap.beer.style}
                    </span>
                  </h3>
                  <div className="text-muted-foreground text-sm">
                    <p>
                      {tap.beer.brewery.name}
                      {tap.beer.abv && ` • ${tap.beer.abv}%`}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
