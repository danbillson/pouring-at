import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react"; // Keep icon for structure

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader className="grid grid-cols-[1fr_1fr_auto] items-center justify-between gap-4">
            {/* Static Title and Description */}
            <div>
              <CardTitle>Beers</CardTitle>
              <CardDescription>View and manage your beers.</CardDescription>
            </div>
            {/* Search Input Skeleton */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Skeleton className="h-10 w-full pl-8" />{" "}
              {/* Mimic input shape */}
            </div>
            {/* New Beer Button Skeleton */}
            <Skeleton className="h-9 w-[108px]" />{" "}
            {/* Approx size of Button with text/icon */}
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {/* List Item Skeletons */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="mb-1 h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
