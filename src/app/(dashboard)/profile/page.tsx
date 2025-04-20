import { SignOut } from "@/components/dashboard/sign-out";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p>{session.user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p>{session.user.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <SignOut />
      </div>
    </div>
  );
}
