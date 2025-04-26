import { BarLogo } from "@/components/bars/bar-logo";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="mt-4 flex items-center gap-4">
          <BarLogo name="" path="" />
          <div>
            <Skeleton className="bg-background h-10 w-48" />
            <Skeleton className="bg-background mt-2 h-4 w-32" />
          </div>
        </div>
        <Skeleton className="bg-background mt-4 h-16 w-full" />
        <Skeleton className="bg-background mt-4 h-96 w-full" />
      </div>
    </div>
  );
}
