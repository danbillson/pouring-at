import { LoginForm } from "@/components/forms/login-form";
import { Beer } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Beer className="size-4" />
          </div>
          pouring.at business
        </Link>
        <LoginForm isBusiness />
      </div>
      <Link
        href="/login"
        className="text-sm text-muted-foreground underline"
      >
        Not a business? Login as a regular user
      </Link>
    </div>
  );
}
