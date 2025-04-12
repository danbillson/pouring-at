interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BarPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Bar: {slug}</h1>
    </div>
  );
}
