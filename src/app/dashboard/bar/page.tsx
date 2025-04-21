import BarDetails from "@/components/dashboard/bar-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAccessToBar } from "@/lib/access";

export default async function BarPage() {
  const bar = await hasAccessToBar();

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Bar Details</CardTitle>
            <CardDescription>
              Customise how your bar is displayed to the public.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarDetails bar={bar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
