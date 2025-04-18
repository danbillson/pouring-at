"use client";

import { CreateBeerForm } from "@/components/forms/create-beer-form";
import { CreateTapForm } from "@/components/forms/create-tap-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AddTapProps {
  barId: string;
  trigger?: React.ReactNode;
}

export function AddTap({ barId, trigger }: AddTapProps) {
  const [open, setOpen] = useState(false);
  const [showCreateBeer, setShowCreateBeer] = useState(false);
  const [selectedBeerId, setSelectedBeerId] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add a beer</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showCreateBeer ? "Add New Beer" : "Add Beer to Tap List"}
          </DialogTitle>
          <DialogDescription>
            {showCreateBeer
              ? "Enter the details of the new beer"
              : "Enter the details of the beer to add to the tap list"}
          </DialogDescription>
        </DialogHeader>

        {showCreateBeer ? (
          <CreateBeerForm
            onSuccess={(beerId) => {
              setSelectedBeerId(beerId);
              setShowCreateBeer(false);
            }}
            onBack={() => setShowCreateBeer(false)}
          />
        ) : (
          <CreateTapForm
            barId={barId}
            defaultBeerId={selectedBeerId}
            onSuccess={() => setOpen(false)}
            onCreateBeer={() => setShowCreateBeer(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
