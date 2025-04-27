"use client";

import { AddBeerDrawer } from "@/components/dashboard/beers/add-beer-drawer";
import { BeerDetail } from "@/components/dashboard/beers/beer-detail";
import { DeleteBeerDialog } from "@/components/dashboard/beers/delete-beer-dialog";
import { EditBeerDrawer } from "@/components/dashboard/beers/edit-beer-drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Beer, Brewery } from "@/db/schema";
import { MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BeerListProps {
  beers: Beer[];
  brewery: Brewery;
}

export function BeerList({ beers, brewery }: BeerListProps) {
  const [filter, setFilter] = useState("");
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredBeers = beers.filter(
    (beer) =>
      beer.name.toLowerCase().includes(filter.toLowerCase()) ||
      beer.style?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader className="grid grid-cols-[1fr_1fr_auto] items-center justify-between gap-4">
          <div>
            <CardTitle>Beers</CardTitle>
            <CardDescription>View and manage your beers.</CardDescription>
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search beers..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8"
            />
          </div>
          <AddBeerDrawer breweryId={brewery.id} />
        </CardHeader>
        <CardContent>
          <ul>
            {filteredBeers.map((beer) => (
              <li
                key={beer.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <BeerDetail beer={beer} brewery={brewery.name} />
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-accent cursor-pointer rounded-md p-2">
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/beers/${beer.id}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBeer(beer);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setSelectedBeer(beer);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selectedBeer && (
        <>
          <EditBeerDrawer
            beer={selectedBeer}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteBeerDialog
            beer={selectedBeer}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </>
  );
}
