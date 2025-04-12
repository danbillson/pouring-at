interface PageProps {
  params: {
    slug: string;
  };
}

export default function BarPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Bar: {params.slug}</h1>
    </div>
  );
}
