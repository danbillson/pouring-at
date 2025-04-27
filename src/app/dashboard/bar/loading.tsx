import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>
                <Skeleton className="h-8 w-48" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </div>
            <Button variant="secondary" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[800px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
