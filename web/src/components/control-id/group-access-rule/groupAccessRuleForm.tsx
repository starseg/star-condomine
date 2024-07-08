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
  groupId: z.number(),
  accessRuleId: z.number(),
});

export default function GroupAccessRuleForm() {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupId: 0,
      accessRuleId: 0,
    },
  });
  const { data: session } = useSession();

  const [groups, setGroups] = useState<Group[]>([]);
  const fetchGroups = async () => {
    if (session)
      try {
        const response = await api.get("group", {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const fetchAccessRules = async () => {
    if (session)
      try {
        const response = await api.get(`accessRule`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setAccessRules(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchGroups();
    fetchAccessRules();
  }, [session]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        accessRuleId: data.accessRuleId,
        groupId: data.groupId,
      };

      const response = await api.post(`groupAccessRule`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Relação registrada!", {
          theme: "colored",
        });
        form.reset({
          groupId: 0,
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
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Grupo</FormLabel>
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
                            ? groups.find(
                                (group) => group.groupId === field.value
                              )?.name
                            : "Selecione um grupo"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar grupo..." />
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                        <CommandGroup>
                          {groups.map((group) => (
                            <CommandItem
                              value={group.name}
                              key={group.groupId}
                              onSelect={() => {
                                form.setValue("groupId", group.groupId);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  group.groupId === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {group.name}
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
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar regra..." />
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
