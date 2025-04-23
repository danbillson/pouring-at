"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Beer } from "@/db/schema";
import { Search } from "lucide-react";
import { useState } from "react";
import { BeerDetail } from "./beer-detail";

interface BeerListProps {
  beers: Beer[];
  brewery: string;
}

export function BeerList({ beers, brewery }: BeerListProps) {
  const [filter, setFilter] = useState("");

  const filteredBeers = beers.filter(
    (beer) =>
      beer.name.toLowerCase().includes(filter.toLowerCase()) ||
      beer.style?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
