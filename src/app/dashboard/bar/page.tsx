import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAccessToBar } from "@/lib/access";

export default async function BarPage() {
  const userBar = await hasAccessToBar();

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Bar Details</CardTitle>
            <CardDescription>
              Customise how your bar is displayed to the public.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p>{userBar.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Address</p>
                <p>
                  {userBar.addressLine1}
                  {userBar.addressLine2 && <>, {userBar.addressLine2}</>}
                  {userBar.city && <>, {userBar.city}</>}
                  {userBar.postcode && <>, {userBar.postcode}</>}
                </p>
              </div>
              {userBar.formattedAddress && (
                <div>
                  <p className="text-muted-foreground text-sm">
                    Formatted Address
                  </p>
                  <p>{userBar.formattedAddress}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-sm">
                  Verification Status
                </p>
                <p>{userBar.verified ? "Verified" : "Unverified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
