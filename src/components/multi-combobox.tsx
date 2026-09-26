import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string; // ข้อความที่แสดงใน dropdown list
  badgeLabel?: string; // ข้อความที่แสดงใน badge (ถ้าไม่ใส่ จะใช้ label แทน)
};

type MultiComboboxProps = {
  options: ComboboxOption[];
  selected: string[]; // เก็บเป็น value เท่านั้น
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledPlaceholder?: string; // ข้อความตอน disabled (เช่น "เลือกวิชาก่อน")
  allowCustom?: boolean; // เปิดให้พิมพ์เพิ่มค่าใหม่ที่ไม่มีใน options (default: true)
};

export function MultiCombobox({
  options,
  selected,
  onChange,
  placeholder,
  disabled,
  disabledPlaceholder,
  allowCustom = true,
}: MultiComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
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
    inputRef.current?.focus();
  };

  const trimmedSearch = search.trim();
  const alreadyExists = [
    ...options.map((o) => o.label),
    ...selected,
  ].some((o) => o.toLowerCase() === trimmedSearch.toLowerCase());

  const getBadgeLabel = (value: string) => {
    const opt = options.find((o) => o.value === value);
    return opt?.badgeLabel ?? opt?.label ?? value; // fallback = value เอง (เคสพิมพ์ชื่อใหม่)
  };

  return (
    <CommandPrimitive shouldFilter className="overflow-visible bg-transparent">
      <PopoverPrimitive.Root
        open={open && !disabled}
        onOpenChange={(v) => !disabled && setOpen(v)}
      >
        <div
          ref={anchorRef}
          onClick={() => !disabled && inputRef.current?.focus()}
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm shadow-xs",
            disabled && "cursor-not-allowed bg-muted opacity-60",
          )}
        >
          {selected.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1">
              {getBadgeLabel(value)}
              <button
                type="button"
                disabled={disabled}
                onClick={() => remove(value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={search}
            onValueChange={setSearch}
            onFocus={() => !disabled && setOpen(true)}
            disabled={disabled}
            placeholder={
              selected.length === 0
                ? disabled
                  ? disabledPlaceholder ?? placeholder
                  : placeholder
                : undefined
            }
            className="min-w-[80px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side="bottom"
            sideOffset={4}
            className="isolate z-50"
          >
            <PopoverPrimitive.Popup
              initialFocus={false}
              className="z-50 w-(--anchor-width) rounded-lg bg-popover p-1 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden"
            >
              <CommandList>
                <CommandGroup>
                  {options.map((o) => (
                    <CommandItem key={o.value} value={o.label} onSelect={() => toggle(o.value)}>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selected.includes(o.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {o.label}
                    </CommandItem>
                  ))}
                  {allowCustom && trimmedSearch && !alreadyExists && (
                    <CommandItem
                      key={`__add_${trimmedSearch}`}
                      value={`__add_${trimmedSearch}`}
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
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </CommandPrimitive>
  );
}