"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export default function Home() {
  const { data } = useSession();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      {data?.user ? (
        <div>
          <p>Welcome {data.user.name}</p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      ) : (
        <p>Welcome</p>
      )}
    </div>
  );
}
