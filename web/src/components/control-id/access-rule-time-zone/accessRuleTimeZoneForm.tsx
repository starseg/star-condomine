"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { Check, ChevronsUpDown, FilePlus2Icon } from "lucide-react";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  accessRuleId: z.number(),
  timeZoneId: z.number(),
});

export default function AccessRuleTimeZoneForm() {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accessRuleId: 0,
      timeZoneId: 0,
    },
  });
  const { data: session } = useSession();

  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const fetchTimeZones = async () => {
    if (session)
      try {
        const response = await api.get("timeZone");
        setTimeZones(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const fetchAccessRules = async () => {
    if (session)
      try {
        const response = await api.get(`accessRule`);
        setAccessRules(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchAccessRules();
    fetchTimeZones();
  }, [session]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await api.post(
        `accessRuleTimeZone`,
        {
          timeZoneId: data.timeZoneId,
          accessRuleId: data.accessRuleId,
        }
      );
      if (response.status === 201) {
        toast.success("Relação registrada!", {
          theme: "colored",
        });
        form.reset({
          timeZoneId: 0,
          accessRuleId: 0,
        });
        triggerUpdate();
      }
    } catch (error) {
      toast.error("Erro ao registrar", {
        theme: "colored",
      });
      console.error("Erro:", error);
      throw error;
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex gap-2">
          <FilePlus2Icon /> Criar relação
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader className="mb-4">
          <SheetTitle>Criar relação</SheetTitle>
          <SheetDescription>Cadastre aqui uma nova relação.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="accessRuleId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Regra de acesso</FormLabel>
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
                            ? accessRules.find(
                              (accessRule) =>
                                accessRule.accessRuleId === field.value
                            )?.name
                            : "Selecione uma regra"}
                          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar grupo..." />
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                        <CommandGroup>
                          {accessRules.map((accessRule) => (
                            <CommandItem
                              value={accessRule.name}
                              key={accessRule.accessRuleId}
                              onSelect={() => {
                                form.setValue(
                                  "accessRuleId",
                                  accessRule.accessRuleId
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  accessRule.accessRuleId === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {accessRule.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeZoneId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário</FormLabel>
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
                            ? timeZones.find(
                              (timeZone) =>
                                timeZone.timeZoneId === field.value
                            )?.name
                            : "Selecione um horário"}
                          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar portaria..." />
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                        <CommandGroup>
                          {timeZones.map((timeZone) => (
                            <CommandItem
                              value={timeZone.name}
                              key={timeZone.timeZoneId}
                              onSelect={() => {
                                form.setValue(
                                  "timeZoneId",
                                  timeZone.timeZoneId
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  timeZone.timeZoneId === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {timeZone.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
