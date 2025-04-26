import { ProfileImageUpload } from "@/components/dashboard/profile/profile-image-upload";
import { SignOut } from "@/components/dashboard/profile/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

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
                <p className="text-muted-foreground mb-4 text-sm">
                  Profile image
                </p>
                <div className="relative w-fit">
                  <Avatar className="size-24">
                    <AvatarImage src={`${storageUrl}/${session.user.image}`} />
                    <AvatarFallback className="bg-foreground text-background text-2xl uppercase">
                      {session.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <ProfileImageUpload userId={session.user.id} />
                </div>
              </div>

              <Separator />

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
