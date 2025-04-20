"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOut() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="justify-start"
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
