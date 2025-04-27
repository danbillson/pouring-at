import { Nav } from "@/components/nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="bg-muted m-2 grid min-h-[calc(100vh-84px)] rounded-lg p-8 pb-20 sm:p-20">
        {children}
      </div>
    </>
  );
}
