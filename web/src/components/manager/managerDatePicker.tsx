"use client";

import * as React from "react";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ManagerDatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const [date, setDate] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    if (date?.from && date?.to) {
      params.set("from", date.from.toISOString());
      params.set("to", date.to.toISOString());
    } else {
      params.delete("from");
      params.delete("to");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 w-4 h-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="start">
          <Calendar
            locale={ptBR}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
