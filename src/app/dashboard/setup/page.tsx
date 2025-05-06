"use server";

import { CreateOrgForm } from "@/components/dashboard/profile/create-org-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SetupPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="container mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {session?.user?.name ? `Welcome ${session.user.name}` : "Welcome"}
          </CardTitle>
          <CardDescription>
            Let's set up your organization. This is where you'll be able to add
            your team members and manage your venues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrgForm />
        </CardContent>
      </Card>
    </div>
  );
}
