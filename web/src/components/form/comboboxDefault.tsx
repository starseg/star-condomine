import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

interface DefaultComboboxProps {
  control: any;
  name: string;
  label: string;
  selectLabel: string;
  searchLabel: string;
  object: any[];
  onSelect: (value: number) => void;
}

export default function DefaultCombobox({
  control,
  name,
  label,
  selectLabel,
  searchLabel,
  object,
  onSelect,
}: DefaultComboboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? object.find((item) => item.value === field.value)?.label
                      : selectLabel}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                <Command className="w-full">
                  <CommandInput placeholder={searchLabel} />
                  <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                  <CommandGroup>
                    {object.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          onSelect(item.value);
                        }}
                        className={cn(
                          item.comments.length > 0 &&
                            "text-yellow-400 font-semibold"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                        {item.address && (
                          <>
                            {" "}
                            - {item.addressType} {item.address}
                          </>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
