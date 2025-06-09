"use client";

import { getBar, queryBars } from "@/actions/bar";
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
import { ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface BarSearchProps {
  value?: string;
  name?: string;
  onChange: (value: { id?: string; name: string }) => void;
  onCreateNew?: () => void;
}

interface SearchedBar {
  id: string;
  name: string;
  slug: string | null;
}

export function BarSearch({
  value,
  name,
  onChange,
  onCreateNew,
}: BarSearchProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<SearchedBar[]>([]);
  const [selectedBar, setSelectedBar] = useState<SearchedBar | null>(null);

  // Load initial bar if value is provided
  useEffect(() => {
    if (value) {
      startTransition(async () => {
        const result = await getBar(value);
        if (result) {
          const { id, name, slug } = result as {
            id: string;
            name: string;
            slug: string | null;
          };
          setSelectedBar({ id, name, slug });
        }
      });
    }
  }, [value]);

  const runSearch = async (query: string) => {
    const result = await queryBars(query);
    if (result.success && result.data) {
      setSearchResults(
        result.data.map(({ id, name, slug }) => ({ id, name, slug }))
      );
    } else {
      setSearchResults([]);
    }
  };

  const setSearchDebouncer = useAsyncDebouncer(
    async (value: string) => {
      startTransition(() => {
        runSearch(value);
        onChange({ name: value });
      });
    },
    { wait: 300 }
  );

  useEffect(() => {
    return () => {
      setSearchDebouncer.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isPending}
        >
          {value
            ? (selectedBar?.name ??
              searchResults.find((bar) => bar.id === value)?.name ??
              name ??
              "Loading...")
            : "Select bar..."}
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
            {searchResults.map((bar) => (
              <CommandItem
                key={bar.id}
                value={bar.id}
                onSelect={(currentValue) => {
                  const selected =
                    currentValue === value
                      ? { name: bar.name }
                      : { id: currentValue, name: bar.name };
                  onChange(selected);
                  setOpen(false);
                }}
              >
                {bar.name}
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                onCreateNew?.();
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Add a new bar
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
