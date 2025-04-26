import { BarLogo } from "@/components/bars/bar-logo";
import { TapList } from "@/components/tap-list";
import { getBar } from "@/lib/bars";
import { cn } from "@/lib/utils/utils";
import { notFound } from "next/navigation";

export default async function BarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bar = await getBar(id);

  if (!bar) {
    notFound();
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div
          className={cn("flex items-center gap-4", bar.coverImage && "mt-4")}
        >
          {bar.logo && <BarLogo name={bar.name} path={bar.logo} />}
          <div>
            <h1 className="text-4xl font-bold">{bar.name}</h1>
            <p className="text-muted-foreground text-sm">
              {bar.formattedAddress}
            </p>
          </div>
        </div>

        <TapList barId={bar.id} />
      </div>
    </div>
  );
}
