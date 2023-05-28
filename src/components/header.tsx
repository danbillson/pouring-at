import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export const Header = () => {
  const { isSignedIn } = useAuth();
  return (
    <header className="mx-auto flex max-w-4xl justify-between p-8">
      <Link href="/" className="text-xl font-bold">
        Fresh on Tap
      </Link>
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
    </header>
  );
};