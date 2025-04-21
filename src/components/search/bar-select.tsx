"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Store } from "lucide-react";
import { useEffect, useState } from "react";

interface Bar {
  id: string;
  name: string;
  formattedAddress?: string;
}

async function searchBars(search: string) {
  if (!search) return [];
  const response = await fetch(
    `/api/bars/search?q=${encodeURIComponent(search)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch bars");
  }
  const data = await response.json();
  return data.bars as Bar[];
}

async function getBar(id: string) {
  const response = await fetch(`/api/bars/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bar");
  }
  const data = await response.json();
  return data.bar as Bar;
}

export function BarSelect() {
  const { selectedBarId, setSelectedBar, showBarSelect } = useDashboard();
  const [open, setOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Don't render if bar select should be hidden
  if (!showBarSelect) return null;

  const { data: bars = [] } = useQuery({
    queryKey: ["bars", debouncedSearch],
    queryFn: () => searchBars(debouncedSearch),
  });

  const { data: selectedBar } = useQuery({
    queryKey: ["bar", selectedBarId],
    queryFn: () => (selectedBarId ? getBar(selectedBarId) : null),
    enabled: !!selectedBarId,
  });

  const setSearchDebouncer = useAsyncDebouncer(
    (value: string) => {
      setDebouncedSearch(value);
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    return () => {
      setSearchDebouncer.cancel();
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-none"
        >
          <div className="flex items-center gap-2">
            <div className="bg-foreground text-background rounded-sm p-1">
              <Store className="h-4 w-4" />
            </div>
            <span>
              {selectedBarId
                ? (selectedBar?.name ??
                  bars.find((bar) => bar.id === selectedBarId)?.name ??
                  "Loading...")
                : "Select bar..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search bars..."
            onValueChange={(value) => {
              setSearchDebouncer.maybeExecute(value);
            }}
          />
          <CommandList>
            {bars.map((bar) => (
              <CommandItem
                key={bar.id}
                value={bar.id}
                onSelect={(currentValue) => {
                  setSelectedBar(
                    currentValue === selectedBarId ? null : currentValue
                  );
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>{bar.name}</span>
                  {bar.formattedAddress && (
                    <span className="text-muted-foreground text-xs">
                      {bar.formattedAddress}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
