"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LocationInput() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      router.push(`/search?location=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mx-4 max-w-md flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-muted w-full border-0 pl-8"
        />
      </div>
    </form>
  );
}
