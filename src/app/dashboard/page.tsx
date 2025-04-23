"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const { selectedVenue, isStandardUser } = useDashboard();

  if (!selectedVenue) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your dashboard</CardTitle>
            {!isStandardUser && (
              <CardDescription>
                Please select a venue to get started
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your dashboard</CardTitle>
            <CardDescription>
              Manage your {selectedVenue.type} and view important information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link href={`/dashboard/${selectedVenue.type}`}>
                <Button>Go to {selectedVenue.type} dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
