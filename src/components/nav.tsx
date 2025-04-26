import { LocationInput } from "@/components/search/location-input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export async function Nav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 p-4">
      <Link href="/" className="hidden font-bold sm:block">
        pouring<span className="text-amber-500">.</span>at
      </Link>
      <Link href="/" className="font-bold sm:hidden">
        p<span className="text-amber-500">.</span>
      </Link>

      <LocationInput />

      {session?.user ? (
        <Button variant="ghost" asChild>
          <Link href="/dashboard/profile">
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
