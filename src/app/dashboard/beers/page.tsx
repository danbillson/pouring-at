import { BeerList } from "@/components/dashboard/beer-list";
import { hasAccessToBrewery } from "@/lib/access";
import { getBreweryBeers } from "@/lib/breweries";

export default async function BreweryPage() {
  const brewery = await hasAccessToBrewery();
  const beers = await getBreweryBeers(brewery.id);

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <BeerList beers={beers} brewery={brewery.name} />
      </div>
    </div>
  );
}
