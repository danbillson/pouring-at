"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LocationInputProps = React.ComponentProps<"input">;

export function LocationInput({ className, ...props }: LocationInputProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      router.push(`/search?location=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-md flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search by location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={cn("bg-muted w-full border-0 pl-8", className)}
          {...props}
        />
      </div>
    </form>
  );
}
