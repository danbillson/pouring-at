"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mailbox } from "lucide-react";

interface VerifyEmailProps {
  email: string;
}

export function VerifyEmail({ email }: VerifyEmailProps) {
  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <Mailbox className="mx-auto size-10 text-amber-500" />
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent an email to <span className="text-foreground">{email}</span>
            . To verify your account, click the link in the email.
          </CardDescription>
        </CardHeader>
      </Card>
      <p className="text-muted-foreground text-center text-sm">
        Can&apos;t find our email? Check your spam folder!
      </p>
    </>
  );
}
