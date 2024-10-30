'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

interface SelectFilterProps {
  defaultValue?: string;
  values: {
    label: string;
    value: string;
  }[];
  label: string;
  pagination: boolean;
  classname?: string;
}

export function SelectFilter({
  defaultValue = "",
  values,
  label,
  pagination,
  classname,
}: SelectFilterProps) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pagination) params.set("page", "1");
    if (term) {
      if (term === "Todos") {
        params.delete("status");
        return replace(`${pathname}?${params.toString()}`);
      }
      params.set("status", term);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={cn("w-full", classname)}>
      <Select defaultValue={defaultValue} onValueChange={handleChange}>
        <SelectTrigger className="hover:bg-accent hover:text-accent-foreground outline-none data-[placeholder]:text-muted-foreground">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {values.map((value) => (
            <SelectItem key={value.value} value={value.value}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}