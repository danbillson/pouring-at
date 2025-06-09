"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface EmailExistsProps {
  email: string;
}

export function EmailExists({ email }: EmailExistsProps) {
  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email already exists</CardTitle>
          <CardDescription>
            The email <span className="text-foreground">{email}</span> is
            already registered. Please try signing in instead or use a different
            email address.
          </CardDescription>
        </CardHeader>
      </Card>
      <p className="text-muted-foreground text-center text-sm">
        Forgot your password? You can reset it from the{" "}
        <Link href="/user-flow" className="underline underline-offset-4">
          login page
        </Link>
        .
      </p>
    </>
  );
}
