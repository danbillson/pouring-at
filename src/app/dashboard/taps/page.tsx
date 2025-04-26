import { AddTap } from "@/components/add-tap";
import { BeerDetail } from "@/components/dashboard/beer-detail";
import { DeleteTapButton } from "@/components/dashboard/delete-tap-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAccessToBar } from "@/lib/auth/access";
import { getTaps } from "@/lib/taps";

export default async function TapsPage() {
  const bar = await hasAccessToBar();
  const taps = await getTaps(bar.id);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tap List</CardTitle>
            <CardDescription>
              Manage the beers currently available at your bar.
            </CardDescription>
          </div>
          <AddTap barId={bar.id} />
        </CardHeader>
        <CardContent>
          {taps.length === 0 ? (
            <div className="bg-muted grid place-items-center rounded-md px-6 py-12">
              <p className="text-muted-foreground mb-6">
                No beers currently on tap
              </p>
              <AddTap barId={bar.id} />
            </div>
          ) : (
            <ul>
              {taps.map((tap) => (
                <li
                  key={tap.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <BeerDetail beer={tap.beer} brewery={tap.beer.brewery.name} />

                  <DeleteTapButton tap={tap} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
