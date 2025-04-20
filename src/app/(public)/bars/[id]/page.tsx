import { TapList } from "@/components/tap-list";
import { getBar } from "@/lib/bars";
import { notFound } from "next/navigation";

export default async function BarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const barData = await getBar(id);

  if (!barData) {
    notFound();
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <h1 className="text-4xl font-bold">{barData.name}</h1>
        <p className="text-muted-foreground text-sm">
          {barData.formattedAddress}
        </p>

        <TapList barId={barData.id} />
      </div>
    </div>
  );
}
