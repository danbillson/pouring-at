import BreweryDetails from "@/components/dashboard/brewery-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAccessToBrewery } from "@/lib/auth/access";
import Link from "next/link";

export default async function BreweryPage() {
  const brewery = await hasAccessToBrewery();

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Brewery Details</CardTitle>
              <CardDescription>
                Customise how your brewery is displayed to the public.
              </CardDescription>
            </div>
            <Link href={`/breweries/${brewery.id}`}>
              <Button variant="secondary">View brewery page</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <BreweryDetails brewery={brewery} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
