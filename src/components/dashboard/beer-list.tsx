"use client";

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
import { Beer } from "@/db/schema";
import { MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BeerDetail } from "./beer-detail";
import { DeleteBeerDialog } from "./delete-beer-dialog";
import { EditBeerDrawer } from "./edit-beer-drawer";

interface BeerListProps {
  beers: Beer[];
  brewery: string;
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
        <CardHeader className="grid grid-cols-2 items-center justify-between">
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
        </CardHeader>
        <CardContent>
          <ul>
            {filteredBeers.map((beer) => (
              <li
                key={beer.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <BeerDetail beer={beer} brewery={brewery} />
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
