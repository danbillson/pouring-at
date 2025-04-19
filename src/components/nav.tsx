import { LocationInput } from "@/components/search/location-input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export async function Nav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <Link
        href="/"
        className="bg-muted rounded-lg px-2 py-1 text-xl font-bold"
      >
        pouring.at
      </Link>

      <LocationInput />

      {session?.user ? (
        <Button variant="ghost" asChild>
          <Link href="/profile">
            <User className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="default" asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </nav>
  );
}
