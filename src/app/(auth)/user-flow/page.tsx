import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function UserFlowPage() {
  return (
    <div className="flex min-h-svh flex-col items-center p-6 pt-20">
      <h1 className="mb-8 text-2xl font-semibold text-center">Sign up/log in</h1>
      <div className="flex w-full max-w-md flex-col gap-4">
        <Link href="/login" className="block">
          <Card className="cursor-pointer group">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-medium">Pouring.at for drinkers</div>
                <div className="text-muted-foreground text-sm">Find and track beers, bars, breweries</div>
              </div>
              <ArrowRight className="ml-4 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/business/login" className="block">
          <Card className="cursor-pointer group">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-medium">Pouring.at for business</div>
                <div className="text-muted-foreground text-sm">Manage your bar or brewery</div>
              </div>
              <ArrowRight className="ml-4 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 