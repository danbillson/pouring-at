import { getBreweryBeersAction } from "@/actions/brewery";
import { BeerList } from "@/components/dashboard/beers/beer-list";
import { hasAccessToBrewery } from "@/lib/auth/access";
import { notFound } from "next/navigation";

export default async function BreweryBeersDashboardPage() {
  const brewery = await hasAccessToBrewery();

  if (!brewery) {
    notFound();
  }

  const { success, data: beers } = await getBreweryBeersAction(brewery.id);

  if (!success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">Failed to load beers.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <BeerList beers={beers ?? []} brewery={brewery} />
      </div>
    </div>
  );
}
