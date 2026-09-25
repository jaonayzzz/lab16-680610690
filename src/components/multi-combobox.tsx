import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type MultiComboboxProps = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function MultiCombobox({
  options,
  selected,
  onChange,
  placeholder,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const remove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const trimmedSearch = search.trim();
  const alreadyExists = [...options, ...selected].some(
    (o) => o.toLowerCase() === trimmedSearch.toLowerCase(),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs"
          />
        }
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">
            {placeholder ?? "เลือกผู้สอน"}
          </span>
        )}
        {selected.map((s) => (
          <Badge
            key={s}
            variant="secondary"
            className="gap-1"
            
            onClick={(e) => e.stopPropagation()}
          >
            {s}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                remove(s);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="ค้นหาหรือพิมพ์ชื่อใหม่..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>ไม่พบผู้สอน</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o} onSelect={() => toggle(o)}>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selected.includes(o) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o}
                </CommandItem>
              ))}
              {trimmedSearch && !alreadyExists && (
                <CommandItem
                  onSelect={() => {
                    toggle(trimmedSearch);
                    setSearch("");
                  }}
                >
                  + เพิ่มผู้สอน "{trimmedSearch}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}