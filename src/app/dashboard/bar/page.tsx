import BarDetails from "@/components/dashboard/bar-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAccessToBar } from "@/lib/auth/access";
import Link from "next/link";

export default async function BarPage() {
  const bar = await hasAccessToBar();

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Bar Details</CardTitle>
              <CardDescription>
                Customise how your bar is displayed to the public.
              </CardDescription>
            </div>
            <Link href={`/bars/${bar.id}`}>
              <Button variant="secondary">View bar page</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <BarDetails bar={bar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
